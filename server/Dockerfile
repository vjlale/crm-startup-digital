FROM node:20-alpine

WORKDIR /app

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
