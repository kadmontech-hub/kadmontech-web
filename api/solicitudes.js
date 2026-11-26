import { createHmac } from "node:crypto";
import { neon } from "@neondatabase/serverless";

const POLICY_VERSION = "2026-11-26-v1";
const SERVICES = new Set([
  "Agentes de inteligencia artificial / WhatsApp",
  "Automatización de procesos",
  "Desarrollo web y páginas profesionales",
  "Desarrollo de software o plataformas a medida",
  "Marketing digital y publicidad",
  "Contenido para redes sociales",
  "Imágenes y videos con inteligencia artificial",
  "Consultoría tecnológica",
  "Necesito asesoramiento para definir la solución"
]);
const TIMINGS = new Set([
  "Lo antes posible",
  "Durante el próximo mes",
  "Estoy explorando posibilidades",
  "No especificado"
]);
const MAX_BYTES = 20000;
const idPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const clean = (value, max = 250) => typeof value === "string" ? value.trim().slice(0, max + 1) : "";
const validPhone = (input) => {
  const value = clean(input, 40);
  if (!/^[+]?[\d\s().-]+$/.test(value)) return null;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 8 && digits.length <= 16 ? digits : null;
};
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, private, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Método no permitido." });
  }
  const incomingOrigin = req.headers.origin;
  if (req.headers["sec-fetch-site"] === "cross-site") {
    return res.status(403).json({ ok: false, error: "Origen no autorizado." });
  }
  if (incomingOrigin) {
    try {
      if (new URL(incomingOrigin).host !== req.headers.host) {
        return res.status(403).json({ ok: false, error: "Origen no autorizado." });
      }
    } catch {
      return res.status(403).json({ ok: false, error: "Origen no autorizado." });
    }
  }
  if (Number(req.headers["content-length"] || 0) > MAX_BYTES) {
    return res.status(413).json({ ok: false, error: "La solicitud supera el tamaño permitido." });
  }
  let body = req.body;
  try {
    if (typeof body === "string") body = JSON.parse(body);
  } catch {
    return res.status(400).json({ ok: false, error: "Datos inválidos." });
  }
  if (!body || typeof body !== "object" || Array.isArray(body) || JSON.stringify(body).length > MAX_BYTES) {
    return res.status(400).json({ ok: false, error: "Datos inválidos." });
  }
  if (body.website) return res.status(400).json({ ok: false, error: "No se pudo procesar la solicitud." });
  if (!Number.isFinite(body.startedAt) || Date.now() - body.startedAt < 1800 ||
      Date.now() - body.startedAt > 2 * 60 * 60 * 1000) {
    return res.status(400).json({ ok: false, error: "Recargá la página e intentá nuevamente." });
  }
  const idempotencyKey = clean(body.idempotencyKey, 50);
  const fullName = clean(body.fullName, 160);
  const businessName = clean(body.businessName, 160);
  const phone = validPhone(body.whatsapp);
  const description = clean(body.description, 3000);
  const services = Array.isArray(body.services) ? body.services : [];
  const timing = clean(body.timing, 50) || "No especificado";
  const policyVersion = clean(body.policyVersion, 60);
  const consent = body.consent === true;
  let error = "";
  if (!idPattern.test(idempotencyKey)) error = "Recargá la página para iniciar una nueva solicitud.";
  else if (fullName.length < 2 || fullName.length > 160) error = "Ingresá tu nombre y apellido.";
  else if (businessName.length > 160) error = "El nombre del proyecto es demasiado largo.";
  else if (!phone) error = "Ingresá un WhatsApp válido, con código de país.";
  else if (!services.length || services.length > 9 ||
           services.some(item => typeof item !== "string" || !SERVICES.has(item)) ||
           new Set(services).size !== services.length) error = "Elegí al menos un servicio.";
  else if (description.length > 3000) error = "La descripción supera los 3.000 caracteres.";
  else if (!TIMINGS.has(timing)) error = "Seleccioná un plazo válido.";
  else if (!consent || policyVersion !== POLICY_VERSION) error = "Aceptá la política de privacidad para enviar tu solicitud.";
  if (error) return res.status(400).json({ ok: false, error });
  if (!process.env.DATABASE_URL) {
    return res.status(503).json({ ok: false, error: "El formulario no está disponible. Intentá nuevamente más tarde." });
  }
  const ip = String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || "unknown").split(",")[0].trim();
  const fingerprint = createHmac("sha256", process.env.FORM_RATE_SECRET || process.env.DATABASE_URL)
    .update(ip).digest("hex");
  try {
    const sql = neon(process.env.DATABASE_URL);
    const result = await sql.query(
      "SELECT submission_id, existing_lead, lead_id, submission_status FROM public.capture_kadmon_request($1::uuid,$2,$3,$4,$5::text[],$6,$7,$8,$9)",
      [idempotencyKey, fullName, businessName, phone, services, description, timing, policyVersion, fingerprint]
    );
    if (!result.length) throw new Error("no_result");
    const id = result[0].submission_id;
    return res.status(201).json({
      ok: true,
      id,
      reference: "KT-" + id.replace(/-/g, "").slice(0, 12).toUpperCase(),
      status: result[0].submission_status
    });
  } catch (e) {
    if (e.code === "P0001") {
      return res.status(429).json({ ok: false, error: "Recibimos varias solicitudes recientemente. Intentá de nuevo más tarde." });
    }
    if (e.code === "22023") {
      return res.status(400).json({ ok: false, error: "Revisá los datos e intentá nuevamente." });
    }
    return res.status(503).json({ ok: false, error: "No pudimos registrar la solicitud. Tus datos siguen en el formulario: volvé a intentarlo." });
  }
}
