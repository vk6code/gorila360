# 🚀 Guía de Despliegue - Proxy Inverso en Producción

## 📋 Resumen de Cambios

Hemos implementado un **proxy inverso** para que el frontend use URLs relativas (`/graphql`) en lugar de URLs absolutas. Esto mejora la seguridad y simplifica la configuración.

### ✅ Cambios Realizados

1. **Frontend (`src/main.js`)**: Ahora usa `uri: '/graphql'` en lugar de la URL completa
2. **Vite Config**: Añadido proxy para desarrollo local (`/graphql` → `http://localhost:8000`)
3. **Nginx**: Ya configurado en el servidor con proxy inverso para `/graphql`

---

## 🚀 Despliegue en Producción (gorila360.es)

### Paso 1: Conectar al Servidor

```bash
ssh usuario@gorila360.es  # o la IP de tu servidor Hetzner
```

### Paso 2: Actualizar el Código

```bash
# Ir al directorio del proyecto
cd /var/www/gorila360

# Hacer pull de los cambios
git pull

# Instalar dependencias (si hay nuevas)
npm install
```

### Paso 3: Construir el Frontend

```bash
# Construir con las nuevas URLs relativas
npm run build

# Actualizar el symlink 'current' (ajusta según tu setup)
rm -rf current
ln -s dist current

# O si copias directamente:
# cp -r dist/* current/
```

### Paso 4: Verificar Nginx

```bash
# La configuración de Nginx ya está correcta en:
# /etc/nginx/sites-available/gorila360.conf

# Verificar que esté OK
sudo nginx -t

# Recargar Nginx (opcional)
sudo systemctl reload nginx
```

### Paso 4: Verificar que el Backend esté Corriendo

```bash
# Verificar que el backend esté escuchando en el puerto 8000
sudo netstat -tlnp | grep 8000

# O usando ss
sudo ss -tlnp | grep 8000

# Debería mostrar algo como:
# tcp  0  0  127.0.0.1:8000  0.0.0.0:*  LISTEN  12345/python
```

### Paso 5: Configurar SSL (si no lo tienes)

```bash
# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d gorila360.es -d www.gorila360.es

# Certbot configurará automáticamente Nginx para HTTPS
```

---

## 🧪 Pruebas

### Verificar que Todo Funciona

1. **Acceder a la aplicación**: https://gorila360.es
2. **Abrir DevTools** (F12) → Network
3. **Verificar las peticiones GraphQL**:
   - Deberían ir a `https://gorila360.es/graphql`
   - NO deberían mostrar errores de CORS
   - Deberían devolver datos correctamente

### Comandos de Diagnóstico

```bash
# Ver logs de Nginx
sudo tail -f /var/log/nginx/gorila360_error.log
sudo tail -f /var/log/nginx/gorila360_access.log

# Ver logs del backend
# (ajusta según cómo ejecutes tu backend)
sudo journalctl -u tu-servicio-backend -f

# Verificar que Nginx está corriendo
sudo systemctl status nginx

# Verificar configuración de Nginx
sudo nginx -t
```

---

## 🔄 Flujo de Trabajo de Desarrollo

### Desarrollo Local

```bash
# El proxy de Vite redirige automáticamente /graphql a localhost:8000
npm run dev

# Asegúrate de que el backend esté corriendo en puerto 8000
```

### Producción

```bash
# 1. Construir
npm run build

# 2. Subir al servidor (ejemplo con rsync)
rsync -avz --delete dist/ usuario@servidor:/var/www/gorila360/dist/

# 3. Nginx se encarga del proxy inverso automáticamente
```

---

## 📝 Notas Importantes

### Configuración del Backend

Asegúrate de que tu backend FastAPI:

1. **Esté escuchando en `localhost:8000`** (no en `0.0.0.0:8000`)
2. **Tenga CORS configurado** para aceptar peticiones de tu dominio:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://gorila360.es"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### Rutas de Archivos

- **Frontend compilado**: `/var/www/gorila360/dist/`
- **Configuración Nginx**: `/etc/nginx/sites-available/gorila360`
- **Certificados SSL**: `/etc/letsencrypt/live/gorila360.es/`

### Permisos

```bash
# Asegúrate de que Nginx pueda leer los archivos
sudo chown -R www-data:www-data /var/www/gorila360/dist
sudo chmod -R 755 /var/www/gorila360/dist
```

---

## 🐛 Troubleshooting

### Error: "502 Bad Gateway"

- El backend no está corriendo o no está escuchando en el puerto 8000
- Verificar: `sudo netstat -tlnp | grep 8000`

### Error: "404 Not Found" en /graphql

- Nginx no está redirigiendo correctamente
- Verificar configuración: `sudo nginx -t`
- Ver logs: `sudo tail -f /var/log/nginx/gorila360_error.log`

### Error de CORS

- Verificar configuración de CORS en el backend
- Asegurarse de que el backend acepta peticiones de `https://gorila360.es`

### Frontend no carga

- Verificar que los archivos estén en `/var/www/gorila360/dist/`
- Verificar permisos: `ls -la /var/www/gorila360/dist/`

---

## 🎯 Ventajas de Esta Configuración

✅ **Seguridad**: No expones el puerto 8000 directamente
✅ **Simplicidad**: Una sola URL para frontend y backend
✅ **Sin CORS**: No hay problemas de CORS porque todo viene del mismo dominio
✅ **SSL/TLS**: Todo el tráfico está cifrado
✅ **Escalabilidad**: Fácil añadir load balancing o múltiples backends

---

## 📞 Soporte

Si tienes problemas, revisa:

1. Logs de Nginx: `/var/log/nginx/gorila360_error.log`
2. Logs del backend
3. DevTools del navegador (Network tab)
