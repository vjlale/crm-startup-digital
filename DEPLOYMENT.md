# 🚀 Guía de Despliegue - CRM Startup Digital

## Opciones de Despliegue

### 1. Vercel (Recomendado para Frontend)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel

# Para producción
vercel --prod
```

**Configuración automática:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 2. Netlify

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Build local
npm run build

# Desplegar
netlify deploy --prod --dir=dist
```

### 3. Railway (Fullstack)

1. Conectar repositorio de GitHub
2. Railway detectará automáticamente Node.js
3. Variables de entorno necesarias:
   ```
   PORT=3001
   NODE_ENV=production
   ```

### 4. Render

**Web Service Configuration:**
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node

### 5. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["npm", "start"]
```

```bash
# Build y ejecutar
docker build -t crm-startup .
docker run -p 3001:3001 crm-startup
```

## Variables de Entorno

Crear archivo `.env` para producción:

```env
NODE_ENV=production
PORT=3001

# Base de datos (cuando se implemente)
DATABASE_URL=your_database_url

# Email service (cuando se implemente)
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass

# JWT Secret (cuando se implemente auth)
JWT_SECRET=your_jwt_secret
```

## Optimizaciones para Producción

### 1. Build Optimizado

```json
// package.json
{
  "scripts": {
    "build": "vite build --mode production",
    "build:analyze": "vite build --mode production && npx vite-bundle-analyzer dist"
  }
}
```

### 2. Configuración de Vite para Producción

```js
// vite.config.js
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          icons: ['lucide-react']
        }
      }
    }
  }
})
```

### 3. Configuración de Server para Producción

```js
// server.js (optimizado)
import compression from 'compression'
import helmet from 'helmet'

app.use(helmet())
app.use(compression())

// Cache static assets
app.use(express.static('dist', {
  maxAge: '1y',
  etag: true
}))
```

## Monitoreo y Analytics

### 1. Vercel Analytics

```jsx
// src/main.jsx
import { Analytics } from '@vercel/analytics/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Analytics />
  </React.StrictMode>,
)
```

### 2. Error Tracking con Sentry

```bash
npm install @sentry/react @sentry/tracing
```

```jsx
// src/main.jsx
import * as Sentry from '@sentry/react'

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV
})
```

## SSL y Dominio Personalizado

### Vercel
1. Ir a Project Settings → Domains
2. Agregar dominio personalizado
3. Configurar DNS records

### Netlify
1. Site Settings → Domain management
2. Add custom domain
3. Configure DNS

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy CRM

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Base de Datos (Próxima Implementación)

### Opciones Recomendadas:

1. **Supabase** (PostgreSQL + Auth + Storage)
2. **PlanetScale** (MySQL serverless)
3. **MongoDB Atlas** (NoSQL)
4. **Firebase** (Realtime + Auth)

### Ejemplo con Supabase:

```bash
npm install @supabase/supabase-js
```

```js
// lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseKey = 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## Escalabilidad

### Microservicios (Futuro)
- API Gateway
- Lead Service
- Email Service  
- Analytics Service
- Auth Service

### CDN y Cache
- Cloudflare para CDN
- Redis para cache de sesiones
- Cache de API responses

## Seguridad

### Headers de Seguridad
```js
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}))
```

### Rate Limiting
```js
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
})

app.use('/api/', limiter)
```

## Backup y Recuperación

1. **Base de datos**: Backups automáticos diarios
2. **Archivos**: Almacenar en S3 o similar
3. **Código**: Git como backup primario
4. **Configuración**: Variables de entorno documentadas

---

**¡Tu CRM está listo para producción!** 🎉

Para desplegar rápidamente:
1. Push a GitHub
2. Conectar con Vercel
3. ¡Listo en minutos!
