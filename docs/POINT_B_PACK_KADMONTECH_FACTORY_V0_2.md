# KADMONTECH FACTORY — POINT B PACK v0.2

Estado: PILOTO INTERNO / NO BUILD
Método: POINT B FIRST
Regla: NO BUILD WITHOUT APPROVED POINT B

## 01. PRODUCT INTENT
KadmonTech Factory será el sistema operativo interno de KadmonTech para conectar ventas, onboarding, diseño del Point B, construcción, infraestructura, QA, entrega, economics y reutilización de IP.

No será un CRM genérico ni un gestor de tareas genérico. La interfaz seguirá la forma real en la que KadmonTech vende y entrega proyectos de IA/software.

Usuarios V1: Dirección, Comercial, Tecnología/Producto.

## 02. PROBLEMA
Hoy el contexto operativo vive repartido entre chats, WhatsApp, documentos, CRM, GitHub, Vercel, Supabase, propuestas, memoria humana y herramientas separadas. La Factory debe contestar inmediatamente:
- qué clientes/proyectos están activos;
- en qué etapa está cada uno;
- qué está bloqueando el avance;
- qué depende del cliente;
- qué se construyó;
- qué está en producción;
- cuánto costó y cuánto margen dejó;
- qué parte del trabajo se puede reutilizar.

## 03. POINT B EXPERIENCE
Un miembro del equipo entra a factory.kadmontech.com y, sin buscar en chats, entiende la operación completa.

El Command Center muestra:
- clientes activos;
- proyectos en build;
- proyectos esperando al cliente;
- QA pendiente;
- alertas y bloqueos;
- próximos hitos;
- actividad comercial relevante;
- snapshot económico.

Al abrir un proyecto ve una ficha viva con:
- valor contractual y cobrado;
- etapa actual;
- health;
- bloqueo principal;
- dependencia del cliente;
- timeline de hitos;
- Point B aprobado;
- build e infraestructura;
- datos faltantes;
- QA;
- economics;
- delivery;
- reusable IP extraída del proyecto.

## 04. VISUAL NORTH STAR
Dirección visual provisional:
- premium B2B operating system;
- sobrio, tecnológico, alta densidad controlada;
- oscuro por defecto con superficies profundas y contraste fuerte;
- acentos cian/azul KadmonTech restringidos a estados y acciones;
- tipografía limpia, jerarquía fuerte y números grandes sólo donde aportan;
- cero estética gamer/cyberpunk decorativa;
- cero tarjetas flotantes sin función;
- sensación de centro de mando, no de SaaS genérico;
- información operativa primero, ornamento después.

Referencias conceptuales, no para copiar: Linear, Stripe Dashboard, Vercel, modern command centers y product operations tools.

## 05. INFORMATION ARCHITECTURE

### 00 AUTH
- Login

### 01 COMMAND CENTER
- Today
- Active Projects
- Alerts
- Client Dependencies
- Delivery Queue
- Business Snapshot

### 02 SALES
- Pipeline
- Leads
- Demos
- Proposals
- Closed Won

### 03 CLIENTS
- Client List
- Client Profile
- Contacts
- Commercial History
- Active/Archived Projects

### 04 PROJECTS
Cada proyecto contiene:
- Overview
- Point B
- Build
- Client Data
- Infrastructure
- QA
- Economics
- Delivery
- Knowledge

### 05 POINT B LIBRARY
- Draft
- Visualizing
- Awaiting Approval
- Approved
- Historical

### 06 PRODUCT LIBRARY
- Components
- Modules
- Templates
- Product Cores
- Reusable Prompts/SOPs

### 07 OPERATIONS
- Blockers
- Client Dependencies
- Deployments
- Incidents
- Waiting States

### 08 SETTINGS
- Team
- Roles
- Integrations
- Organization

## 06. KEY SCREEN 01 — COMMAND CENTER
Objetivo: entender en menos de 30 segundos qué necesita atención hoy.

Desktop layout:
- left permanent navigation;
- top command/search bar;
- compact status strip;
- main column: Today + Active Projects;
- secondary column: Blockers + Client Dependencies + Deployments;
- lower area: Business Snapshot and Delivery Pipeline.

Example real content:
KUPER — Waiting client — WhatsApp data pending
KadmonTech — Point B Pilot — Visual direction in progress
Prospecting — Batch — Contact progress

No fake KPI percentages.

## 07. KEY SCREEN 02 — PROJECT OVERVIEW
Header:
- Client / Project
- Stage
- Health
- Contract Value
- Collected
- Owner

Primary block:
CURRENT STAGE
BLOCKED BY
NEXT MILESTONE
CLIENT DEPENDENCY

Timeline:
Closed Won → Payment → Onboarding → Point B → Build → QA → Production → Delivery → Operation → Case Study

Tabs:
Overview | Point B | Build | Client Data | Infrastructure | QA | Economics | Delivery | Knowledge

## 08. KEY SCREEN 03 — POINT B WORKSPACE
Top status:
DRAFT / VISUALIZING / REVIEW / APPROVED / SUPERSEDED

Sections:
- Product Intent
- Point B Experience
- Visual North Star
- Screen Map
- Golden Flow
- Key Visuals
- V1 Scope
- V1.1
- V2
- Not Now
- Build Handoff

The Key Visuals section is dominant. Text supports the visual destination; it does not replace it.

Approval must record approver and timestamp before Build becomes READY.

## 09. KEY SCREEN 04 — BUILD & INFRASTRUCTURE
Build should not use subjective progress bars.

Show milestone states instead:
- Not started
- In progress
- Blocked
- Ready for QA
- Done

Domains:
Frontend
Backend
Database
Auth
Integrations
AI
QA
Deployment

Infrastructure cards:
GitHub repo
Vercel project/deployment
Supabase project
Domain
Meta/WhatsApp
AI provider
Health / last checked

## 10. KEY SCREEN 05 — CLIENT DATA
Purpose: eliminate the question “¿qué nos faltaba pedirle al cliente?”.

Grouped checklist:
Brand assets
Business information
Content
Access credentials
Operational rules
Product/service catalogue
Legal/approval items

Each item:
status, owner, requested date, received date, source/link, notes.

## 11. KEY SCREEN 06 — ECONOMICS
Show:
Contract value
Collected
Outstanding
Direct infra cost
Variable usage
Human build hours
Support hours
External services
Estimated contribution margin
Recurring revenue / monthly care when applicable

Must distinguish:
SHARED PLATFORM COST
CLIENT INCREMENTAL COST
HUMAN COST

## 12. KEY SCREEN 07 — PRODUCT LIBRARY / REUSABLE IP
Every completed project is decomposed into:
CUSTOM_FOR_CLIENT
REUSABLE_COMPONENT
REUSABLE_MODULE
TEMPLATE
PRODUCT_CORE
SOP/PROMPT

Example from KUPER:
Auth Core → reusable component
Knowledge Manager → reusable module
WhatsApp secure webhook → reusable module
Reception Digital Core → potential product core
KUPER identity/content → custom

## 13. GOLDEN FLOW
Closed Won
→ Project created
→ Onboarding complete
→ Point B drafted
→ Key Visuals generated
→ Point B approved
→ Build Handoff
→ Build milestones
→ QA
→ Production
→ Delivery
→ Operation
→ Economics review
→ Case study eligibility
→ Reusable IP extraction

## 14. STATES
Every operational screen must have:
Empty
Populated
Loading
Blocked
Error
Waiting Client
Ready for Review
Approved/Done

## 15. MOBILE POINT B
Mobile is not a compressed desktop dashboard.
Primary mobile jobs:
- see Today;
- inspect blockers;
- approve/reject Point B;
- check project status;
- mark client data received;
- view critical deployment state.

Deep editing can remain desktop-first in V1.

## 16. SCOPE FREEZE — PROVISIONAL
### V1
Command Center
Clients
Projects
Point B Workspace
Client Data
Build milestones
Infrastructure links/status
Economics baseline
Reusable IP classification
Team roles

### V1.1
Sales sync
Deployment health automation
Notifications
Activity log
Exports

### V2
Client portal
Automated proposal generation
Automated billing
AI project copilot
Cross-project analytics
Advanced product library search

### NOT NOW
Full project management replacement
Chat replacement
Accounting ERP
Generic CRM for external companies
Complex HR management

## 17. DEFINITION OF DONE FOR POINT B
Point B is ready only when:
1. the product can be explained as a finished experience;
2. screen architecture is coherent;
3. at least 5 master visuals exist;
4. desktop + mobile direction is visible;
5. empty and populated states are represented;
6. V1 and Not Now are explicit;
7. user approves visual direction;
8. only then is Build Handoff generated.

## 18. FIRST VISUAL BATTERY
Before any code, generate independently:
1. Command Center — Desktop
2. Project Overview — Desktop
3. Point B Workspace — Desktop
4. Build & Infrastructure — Desktop
5. Product Library / Reusable IP — Desktop
6. Command Center — Mobile

These visuals must look like one coherent product family.

## 19. PRODUCTION GATE
No public-facing visual change is deployed from a Point B experiment. Experiments live in a branch/preview until explicit approval.
