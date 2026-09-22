# KADMONTECH FACTORY — POINT B PACK v0.3

Estado: PILOTO INTERNO / POINT B CANON EN DEFINICIÓN
Método: POINT B FIRST
Regla: NO BUILD WITHOUT APPROVED POINT B

## 01. PRODUCT INTENT
KadmonTech Factory será el sistema operativo interno mínimo de KadmonTech para responder cinco preguntas operativas sin depender de memoria, chats o herramientas dispersas:
- qué proyectos existen;
- en qué estado está cada uno;
- qué está bloqueado;
- qué depende del cliente;
- cuál es el próximo paso y quién lo tiene.

La V1 NO intentará ser un ERP, CRM completo, gestor de tareas universal ni suite empresarial total. Debe ser simple, intuitiva y extensible por módulos cuando aparezca una necesidad real.

Usuarios V1: Dirección, Tecnología/Producto y equipo operativo autorizado.

## 02. DESIGN PRINCIPLE
La complejidad debe vivir detrás de la interfaz, no delante del usuario.

Reglas:
- mostrar sólo información accionable;
- evitar métricas que todavía no se usan para decidir;
- evitar secciones creadas sólo porque podrían servir en el futuro;
- permitir que cada proyecto tenga contexto suficiente sin convertir la home en una enciclopedia;
- crecer por capas y por necesidad real;
- preferir estados objetivos a porcentajes subjetivos;
- toda pantalla debe ayudar a contestar “¿qué necesita atención ahora?”.

## 03. CANON VISUAL 01 — COMMAND CENTER
La primera visualización canónica fue aprobada como dirección general.

Lo que se conserva del concepto:
- sidebar persistente;
- header con búsqueda;
- saludo/contexto operacional;
- KPIs mínimos;
- sección Hoy;
- bloqueos/dependencias;
- proyectos activos;
- actividad reciente;
- estética enterprise sobria, clara, premium y tecnológica.

Recorte para V1:
Sidebar:
- Command Center
- Clients
- Projects
- Operations
- Settings

Se ocultan de V1 inicial:
- Sales
- Point B Library como módulo global
- Product Library como módulo global

Ambos conceptos siguen existiendo dentro del modelo, pero no ocupan navegación principal hasta que su uso cotidiano lo justifique.

KPIs V1:
- Clientes activos
- Proyectos en curso
- Esperando cliente
- Listos para QA
- Bloqueados (opcional si aporta señal real)

Fuera de V1 home:
- MRR
- métricas aspiracionales o no integradas
- banner decorativo de marca
- frase motivacional
- widgets sin acción clara

## 04. CORE OPERATIONAL STATES
Estados operativos permitidos en V1:
- ON_TRACK
- WAITING_CLIENT
- BLOCKED
- READY_FOR_QA
- DONE

Estados de trabajo interno cuando aplique:
- NOT_STARTED
- IN_PROGRESS
- IN_REVIEW

Evitar sinónimos innecesarios.

Cada proyecto debe tener siempre:
- Owner
- Current Stage
- Health / Operational State
- Next Action
- Client Dependency cuando exista
- Last Update

## 05. INFORMATION ARCHITECTURE — V1

### 00 AUTH
- Login

### 01 COMMAND CENTER
- KPI strip
- Today
- Blockers / Client Dependencies
- Active Projects
- Recent Activity

### 02 CLIENTS
- Client List
- Client Detail básico
- Contacts
- Active Projects

### 03 PROJECTS
- Project List
- Project Detail

Project Detail tabs V1:
- Overview
- Point B
- Build
- Client Data
- Infrastructure
- Knowledge

### 04 OPERATIONS
- Global Blockers
- Waiting Client
- Ready for QA
- Deployment / Infrastructure incidents when relevant

### 05 SETTINGS
- Team
- Roles
- Organization basics

## 06. PROJECT DETAIL — V1 PURPOSE
Project Detail debe ser la segunda pantalla canónica porque concentra la operación real de cada cliente/proyecto.

Debe permitir responder en segundos:
- ¿qué estamos construyendo?
- ¿en qué etapa está?
- ¿qué falta?
- ¿qué lo bloquea?
- ¿qué sigue?
- ¿qué depende del cliente?
- ¿quién es responsable?
- ¿cuál es el Point B aprobado?
- ¿qué infraestructura está conectada?

Header mínimo:
- Project / Client
- Stage
- Operational State
- Owner
- Next Action

Primary summary:
- Current Stage
- Blocked By
- Client Dependency
- Next Milestone

Timeline simple:
Closed Won → Onboarding → Point B → Build → QA → Production → Delivery

## 07. POINT B WORKSPACE — V1
Point B vive dentro del proyecto; no necesita una librería global en la primera versión.

Estados:
- DRAFT
- VISUALIZING
- REVIEW
- APPROVED
- SUPERSEDED

Contenido:
- Product Intent
- Point B Experience
- Visual North Star
- Screen Map
- Key Visuals
- Golden Flow
- V1 Scope
- Not Now
- Build Handoff

Key Visuals es el núcleo. El texto documenta; no reemplaza la visualización.

## 08. BUILD — V1
No usar barras subjetivas de progreso.

Dominios posibles:
- Frontend
- Backend
- Database
- Auth
- Integrations
- AI
- QA
- Deployment

Cada dominio usa sólo estados objetivos:
- NOT_STARTED
- IN_PROGRESS
- BLOCKED
- READY_FOR_QA
- DONE

## 09. CLIENT DATA — V1
Checklist agrupado para eliminar la pregunta “¿qué nos faltaba pedirle al cliente?”.

Grupos posibles:
- Brand assets
- Business information
- Content
- Credentials / Access
- Operational rules
- Products / Services
- Approvals

Cada item puede tener:
- status
- owner
- requested_at
- received_at
- source/link
- notes

## 10. INFRASTRUCTURE — V1
Mostrar sólo integraciones reales del proyecto.

Ejemplos:
- GitHub
- Vercel
- Supabase
- Domain
- WhatsApp / Meta
- AI provider

Cada integración muestra:
- status
- identifier/link
- environment
- last check when available

## 11. KNOWLEDGE — V1
Knowledge dentro del proyecto contiene sólo conocimiento operativo necesario para entregar y mantener el cliente.

Puede incluir:
- FAQs
- business rules
- service catalogue
- approved copy
- technical notes
- handoff notes

No construir todavía un knowledge management system global complejo.

## 12. SCOPE FREEZE — V1 CANON
### IN V1
- Login
- Command Center
- Clients List
- Client Detail básico
- Projects List
- Project Detail
- Point B dentro de Project Detail
- Build milestones
- Client Data
- Infrastructure
- Knowledge
- Global Operations básico
- Settings mínimo
- Owner + Next Action + Client Dependency
- estados operativos estandarizados

### V1.1 — ONLY AFTER V1 USE
- Notifications
- Search global real
- Activity log más profundo
- QA workspace dedicado
- Economics
- exports
- deployment health automation
- reusable IP extraction asistida

### V2 — WHEN JUSTIFIED
- Sales module / CRM sync
- Point B Library global
- Product Library global
- Client portal
- automated proposal generation
- automated billing
- AI project copilot
- cross-project analytics

### NOT NOW
- full project management replacement
- chat replacement
- accounting ERP
- generic external CRM
- complex HR
- vanity analytics
- decorative widgets without operational value

## 13. FIRST VISUAL BATTERY — UPDATED
Canonical sequence:
1. Command Center — Desktop ✅ first direction approved
2. Project Detail — KUPER — Desktop ← NEXT
3. Point B Workspace — Desktop
4. Build & Infrastructure — Desktop
5. Command Center — Mobile

Product Library visual moves out of the immediate V1 battery because the module is not part of initial navigation.

## 14. VISUAL QA GATE
A screen becomes canonical only when the user explicitly approves its visual direction.

No code implementation should precede visual approval for major product surfaces.

No public-facing visual experiment is deployed to production. Experiments stay in branch/preview until explicit approval.

## 15. BUILD GATE
Build may start when:
1. Command Center direction is approved;
2. Project Detail direction is approved;
3. Point B Workspace direction is approved;
4. V1 Scope Freeze is accepted;
5. navigation and state model are stable enough to avoid rework.

POINT B FIRST does not require designing every future screen before code. It requires enough canonical surfaces to make the destination unambiguous.
