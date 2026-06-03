# WaCRM — CRM para WhatsApp 💬

> CRM simple, rápido e intuitivo que se vincula a **WhatsApp por QR o número** (estilo WhatsApp Web), organiza tus chats y te deja **calificar clientes manualmente** mientras conversas. **No usa la API oficial de WhatsApp**, por lo que no genera costos de mensajería.

## ✨ Qué hace (v1)

- 🔗 **Vinculación en 1 paso**: escanea un QR o usa código de emparejamiento por número.
- 💬 **Bandeja en tiempo real**: recibe y responde mensajes desde el navegador.
- 🏷️ **CRM integrado**: estado del lead, calificación (0–100), etiquetas y notas, todo en un **panel de acceso rápido al lado del chat**.
- 📋 **Pipeline Kanban**: arrastra contactos entre estados (Nuevo → Contactado → Calificado → Negociación → Cliente / Perdido).
- 📊 **Dashboard** con métricas en vivo.

## 🏗️ Arquitectura

```
web/ (React + Vite + Tailwind)  ◄──REST + Socket.IO──►  server/ (Node + Express)
                                                          │
                                                  Baileys (WhatsApp Web)
                                                          │
                                                  SQLite (Prisma)
```

- **`server/`** — backend que mantiene la sesión de WhatsApp viva con [Baileys](https://github.com/WhiskeySockets/Baileys), guarda contactos y mensajes en SQLite (Prisma) y emite eventos en tiempo real por Socket.IO.
- **`web/`** — interfaz del CRM.
- **`legacy/`** — CRM demo anterior (mock data), archivado como referencia.

## 🚀 Puesta en marcha

Necesitas **Node.js 18+**. Son dos procesos (backend y frontend).

### 1) Backend

```bash
cd server
cp .env.example .env
npm install
npm run db:push      # crea la base SQLite
npm run dev          # arranca en http://localhost:4000
```

### 2) Frontend

```bash
cd web
cp .env.example .env
npm install
npm run dev          # arranca en http://localhost:5173
```

Abre **http://localhost:5173**, ve a **Conexión** y escanea el QR con tu teléfono
(WhatsApp → Ajustes → Dispositivos vinculados → Vincular un dispositivo).
La sesión queda guardada: en los próximos arranques se reconecta sola.

## ⚠️ Aviso importante

Esta herramienta se conecta a WhatsApp de forma **no oficial** (como WhatsApp Web, vía Baileys).
Esto **infringe los Términos de Servicio de WhatsApp** y existe **riesgo de bloqueo del número**,
especialmente con envíos masivos o automatizados. Úsalo de forma responsable, preferentemente con
números secundarios, y sin spam. No nos responsabilizamos por bloqueos de cuenta.

## 🗺️ Próximas fases (no incluidas en v1)

- Calificación **automática** por palabras clave / IA al leer la conversación.
- Multimedia (imágenes, audios, documentos) y respuestas rápidas / plantillas.
- Ventana flotante / extensión sobre WhatsApp Web.
- Multiusuario, asignación de chats y roles.
- Migración a Postgres y despliegue gestionado.

## 📂 Estructura

```
.
├── server/   # Backend (Baileys + Express + Socket.IO + Prisma/SQLite)
├── web/      # Frontend (React + Vite + Tailwind)
└── legacy/   # CRM demo anterior (archivado)
```
