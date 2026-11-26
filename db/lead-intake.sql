-- KadmonTech / Captación comercial · 2026-11-26
-- Requiere que el esquema público tenga public.leads(id uuid) de Kadmon CRM.
-- No ejecutar en proyectos ajenos a KadmonTech.
CREATE TABLE IF NOT EXISTS public.web_lead_submissions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 idempotency_key uuid NOT NULL UNIQUE,
 created_at timestamptz NOT NULL DEFAULT now(),
 full_name text NOT NULL CHECK(length(btrim(full_name)) BETWEEN 2 AND 160),
 business_name text NOT NULL DEFAULT '',
 whatsapp text NOT NULL CHECK(length(whatsapp) BETWEEN 8 AND 16),
 services text[] NOT NULL CHECK(cardinality(services) BETWEEN 1 AND 9),
 description text NOT NULL DEFAULT '',
 start_timing text NOT NULL,
 policy_version text NOT NULL,
 consent_accepted_at timestamptz NOT NULL DEFAULT now(),
 consent_contact boolean NOT NULL DEFAULT true CHECK(consent_contact=true),
 status text NOT NULL DEFAULT 'SOLICITUD RECIBIDA' CHECK(status='SOLICITUD RECIBIDA'),
 possible_duplicate boolean NOT NULL DEFAULT false,
 lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS web_leads_by_phone ON public.web_lead_submissions(whatsapp,created_at DESC);
CREATE INDEX IF NOT EXISTS web_leads_by_date ON public.web_lead_submissions(created_at DESC);
CREATE TABLE IF NOT EXISTS public.web_form_rate_limits(
 fingerprint text NOT NULL,
 window_start timestamptz NOT NULL,
 attempts integer NOT NULL DEFAULT 1,
 PRIMARY KEY(fingerprint,window_start)
);

CREATE OR REPLACE FUNCTION public.capture_kadmon_request(p_key uuid, p_name text, p_business text, p_phone text, p_services text[], p_description text, p_timing text, p_policy text, p_rate_fingerprint text)
 RETURNS TABLE(submission_id uuid, existing_lead boolean, lead_id uuid, submission_status text)
 LANGUAGE plpgsql
AS $function$
DECLARE prior uuid; lid uuid; duplicate boolean; n integer; sid uuid;
BEGIN
 PERFORM pg_advisory_xact_lock(hashtext(p_key::text));
 SELECT w.id INTO prior FROM public.web_lead_submissions w WHERE w.idempotency_key=p_key;
 IF prior IS NOT NULL THEN
  RETURN QUERY SELECT w.id,w.possible_duplicate,w.lead_id,w.status FROM public.web_lead_submissions w WHERE w.id=prior;
  RETURN;
 END IF;
 IF length(btrim(p_name)) NOT BETWEEN 2 AND 160
   OR length(p_phone) NOT BETWEEN 8 AND 16 OR p_phone !~ '^[0-9]+$'
   OR cardinality(p_services) NOT BETWEEN 1 AND 9 OR length(p_description)>3000
   OR p_timing NOT IN ('Lo antes posible','Durante el próximo mes','Estoy explorando posibilidades','No especificado')
   OR p_policy != '2026-11-26-v1' OR p_rate_fingerprint IS NULL
   OR length(p_rate_fingerprint) NOT BETWEEN 32 AND 128
 THEN RAISE EXCEPTION 'Invalid form payload' USING ERRCODE='22023'; END IF;
 INSERT INTO public.web_form_rate_limits(fingerprint,window_start,attempts)
 VALUES (p_rate_fingerprint,date_trunc('hour',now()),1)
 ON CONFLICT (fingerprint,window_start)
 DO UPDATE SET attempts=public.web_form_rate_limits.attempts+1
 RETURNING attempts INTO n;
 IF n>12 THEN RAISE EXCEPTION 'Rate limit exceeded' USING ERRCODE='P0001'; END IF;
 IF (SELECT count(*) FROM public.web_lead_submissions w WHERE w.whatsapp=p_phone AND w.created_at > now()- interval '1 hour') >= 3
 THEN RAISE EXCEPTION 'Phone request limit exceeded' USING ERRCODE='P0001'; END IF;
 SELECT l.id INTO lid FROM public.leads l WHERE regexp_replace(l.phone,'[^0-9]','','g')=p_phone ORDER BY l.created_at LIMIT 1;
 duplicate:=lid IS NOT NULL;
 IF lid IS NULL THEN
  INSERT INTO public.leads(name,contact_person,phone,opening_message,stage,source,notes)
  VALUES (COALESCE(NULLIF(btrim(p_business),''),btrim(p_name)),btrim(p_name),p_phone,
     'Solicitud recibida desde el formulario web. Aún no se envió ningún mensaje por WhatsApp.',
     'nuevo','sitio_web',
     'Servicios: '||array_to_string(p_services,', ')||E'\nNecesidad: '||COALESCE(p_description,'')||E'\nInicio: '||p_timing)
  ON CONFLICT DO NOTHING RETURNING id INTO lid;
  IF lid IS NULL THEN
   SELECT l.id INTO lid FROM public.leads l WHERE regexp_replace(l.phone,'[^0-9]','','g')=p_phone ORDER BY l.created_at LIMIT 1;
   duplicate:=true;
  END IF;
 END IF;
 IF lid IS NULL THEN RAISE EXCEPTION 'Could not associate lead' USING ERRCODE='23503'; END IF;
 INSERT INTO public.web_lead_submissions
  (idempotency_key,full_name,business_name,whatsapp,services,description,start_timing,policy_version,lead_id,possible_duplicate)
 VALUES(p_key,btrim(p_name),COALESCE(btrim(p_business),''),p_phone,p_services,COALESCE(p_description,''),p_timing,p_policy,lid,duplicate)
 ON CONFLICT (idempotency_key) DO NOTHING RETURNING id INTO sid;
 IF sid IS NULL THEN SELECT w.id INTO sid FROM public.web_lead_submissions w WHERE w.idempotency_key=p_key; END IF;
 RETURN QUERY SELECT w.id,w.possible_duplicate,w.lead_id,w.status FROM public.web_lead_submissions w WHERE w.id=sid;
END $function$;

