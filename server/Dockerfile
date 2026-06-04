# Debian slim en vez de alpine: Prisma funciona de forma confiable aquí
# (alpine/musl da problemas de OpenSSL con el motor de Prisma).
FROM node:20-slim

WORKDIR /app

# OpenSSL y certificados: requeridos por Prisma y por las conexiones HTTPS de Baileys.
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Instalar dependencias (incluye prisma CLI para generar el cliente y hacer db push)
COPY package*.json ./
RUN npm ci

# Generar el cliente de Prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copiar el resto del código
COPY . .

EXPOSE 4000

# El entrypoint crea la carpeta de datos, sincroniza la base y arranca el server.
RUN chmod +x docker-entrypoint.sh
CMD ["./docker-entrypoint.sh"]
