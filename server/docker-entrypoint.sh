#!/bin/sh
set -e

# Carpeta persistente (montada como volumen) para la base SQLite y la sesión de WhatsApp.
mkdir -p /app/data

# Sincronizar el esquema con la base (crea las tablas si no existen).
npx prisma db push --skip-generate

# Arrancar el backend.
exec node src/index.js
