import { randomUUID } from "node:crypto";
import { neon } from "@neondatabase/serverless";
import submit from "./solicitudes.js";

// Temporary QA-only route; never published on main.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (process.env.VERCEL_ENV !== "preview" || req.method !== "GET") {
    return res.status(404).json({ ok: false });
  }
  if (!process.env.DATABASE_URL) return res.status(503).json({ ok: false, phase: "env" });
  const sql = neon(process.env.DATABASE_URL);
  const key = randomUUID();
  const name = "Kadmon QA Solicitud Test";
  const phone = "54911" + String(Date.now() % 100000000).padStart(8, "0");
  const query = () => sql.query(
    "SELECT id,lead_id FROM public.web_lead_submissions WHERE idempotency_key=$1::uuid",
    [key]
  );
  let createdLead = false;
  let leadId = null;
  const responseMock = () => ({
    code: 200, data: null, setHeader() {},
    status(status) { this.code = status; return this; },
    json(data) { this.data = data; return data; }
  });
  try {
    const before = await sql.query("SELECT id FROM public.leads WHERE phone=$1", [phone]);
    createdLead = before.length === 0;
    const body = {
      idempotencyKey: key, startedAt: Date.now() - 8000,
      fullName: name, businessName: "QA Empresa Ficticia",
      whatsapp: "+" + phone,
      services: ["Automatización de procesos","Desarrollo web y páginas profesionales"],
      description: "Control técnico interno, sin contacto real.", timing: "No especificado",
      policyVersion: "2026-11-26-v1", consent: true, website: ""
    };
    const origin = "https://" + req.headers.host;
    const requestMock = (b) => ({ method: "POST", headers: { host: req.headers.host, origin, "x-forwarded-for": req.headers["x-forwarded-for"] || "127.0.0.1" }, body: b });
    const first = responseMock(); await submit(requestMock(body), first);
    const second = responseMock(); await submit(requestMock(body), second);
    const rows = await query(); leadId = rows[0]?.lead_id || null;
    const counts = await sql.query("SELECT count(*)::int AS count FROM public.web_lead_submissions WHERE idempotency_key=$1::uuid", [key]);
    const leadCounts = await sql.query("SELECT count(*)::int AS count FROM public.leads WHERE phone=$1", [phone]);
    const badConsent = responseMock(); await submit(requestMock({ ...body, idempotencyKey: randomUUID(), consent: false }), badConsent);
    const pass = first.code === 201 && second.code === 201 && first.data?.id === second.data?.id &&
      counts[0]?.count === 1 && leadCounts[0]?.count === 1 && badConsent.code === 400;
    return res.status(pass ? 200 : 500).json({
      ok: pass,
      firstStatus: first.code,
      replayStatus: second.code,
      validationStatus: badConsent.code,
      idempotent: first.data?.id === second.data?.id && counts[0]?.count === 1,
      persisted: rows.length === 1 && leadCounts[0]?.count === 1,
      crmAssociated: Boolean(leadId)
    });
  } catch {
    return res.status(500).json({ ok: false, phase: "integration" });
  } finally {
    // Only QA-generated records: never remove existing customer data.
    await sql.query("DELETE FROM public.web_lead_submissions WHERE idempotency_key=$1::uuid", [key]).catch(() => {});
    if (createdLead && leadId) {
      await sql.query("DELETE FROM public.leads WHERE id=$1::uuid AND phone=$2 AND contact_person=$3 AND source='sitio_web'", [leadId, phone, name]).catch(() => {});
    }
  }
}
