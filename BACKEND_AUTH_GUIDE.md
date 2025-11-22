# 🔐 Guía de Implementación de Autenticación OAuth2 en el Backend

## 📋 Resumen

El frontend ya está configurado para manejar autenticación con OAuth2. Ahora necesitas implementar los endpoints en el backend FastAPI.

---

## 🎯 Lo que el Frontend Espera

### Endpoints de OAuth

El frontend redirige a estos endpoints cuando el usuario hace clic en los botones:

1. **Google**: `/auth/google`
2. **Facebook**: `/auth/facebook`
3. **Instagram**: `/auth/instagram`

### Flujo de Autenticación

```
Usuario hace clic → Frontend redirige a /auth/google
→ Backend redirige a Google OAuth
→ Google autentica al usuario
→ Google redirige a /auth/google/callback
→ Backend genera JWT token
→ Backend redirige a /app/dashboard?token=JWT_TOKEN
→ Frontend guarda el token
```

---

## 🔧 Implementación en FastAPI

### 1. Instalar Dependencias

```bash
pip install authlib python-jose[cryptography] passlib[bcrypt]
```

### 2. Configurar Variables de Entorno

Añade a tu `.env`:

```bash
# JWT
SECRET_KEY=tu-clave-secreta-super-segura-cambiala
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080  # 7 días

# Google OAuth
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=tu-facebook-app-id
FACEBOOK_CLIENT_SECRET=tu-facebook-app-secret

# Instagram OAuth (usa Facebook Graph API)
INSTAGRAM_CLIENT_ID=tu-instagram-client-id
INSTAGRAM_CLIENT_SECRET=tu-instagram-client-secret

# URLs
FRONTEND_URL=https://gorila360.es
BACKEND_URL=https://gorila360.es
```

### 3. Crear Utilidades JWT

```python
# app/utils/auth.py
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 10080))

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

### 4. Configurar OAuth

```python
# app/main.py o app/auth/oauth.py
from authlib.integrations.starlette_client import OAuth
from starlette.config import Config
import os

config = Config('.env')
oauth = OAuth(config)

# Google OAuth
oauth.register(
    name='google',
    client_id=os.getenv('GOOGLE_CLIENT_ID'),
    client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Facebook OAuth
oauth.register(
    name='facebook',
    client_id=os.getenv('FACEBOOK_CLIENT_ID'),
    client_secret=os.getenv('FACEBOOK_CLIENT_SECRET'),
    authorize_url='https://www.facebook.com/v18.0/dialog/oauth',
    access_token_url='https://graph.facebook.com/v18.0/oauth/access_token',
    client_kwargs={'scope': 'email public_profile'}
)

# Instagram OAuth (usa Facebook Graph API)
oauth.register(
    name='instagram',
    client_id=os.getenv('INSTAGRAM_CLIENT_ID'),
    client_secret=os.getenv('INSTAGRAM_CLIENT_SECRET'),
    authorize_url='https://api.instagram.com/oauth/authorize',
    access_token_url='https://api.instagram.com/oauth/access_token',
    client_kwargs={'scope': 'user_profile,user_media'}
)
```

### 5. Crear Endpoints de Autenticación

```python
# app/routers/auth.py
from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from app.utils.auth import create_access_token
from app.main import oauth  # o donde hayas configurado oauth
import os

router = APIRouter(prefix="/auth", tags=["auth"])

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://gorila360.es")

# ============ GOOGLE ============
@router.get('/google')
async def login_google(request: Request):
    redirect_uri = request.url_for('auth_google_callback')
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get('/google/callback')
async def auth_google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get('userinfo')

        # Aquí creas o actualizas el usuario en tu base de datos
        user = await get_or_create_user(
            email=user_info['email'],
            name=user_info.get('name'),
            picture=user_info.get('picture'),
            provider='google',
            provider_id=user_info['sub']
        )

        # Generar JWT
        access_token = create_access_token({
            'sub': str(user.id),
            'email': user.email,
            'name': user.name
        })

        # Redirigir al frontend con el token
        return RedirectResponse(
            url=f'{FRONTEND_URL}/app/dashboard?token={access_token}'
        )
    except Exception as e:
        print(f"Error en Google OAuth: {e}")
        return RedirectResponse(url=f'{FRONTEND_URL}/login?error=auth_failed')

# ============ FACEBOOK ============
@router.get('/facebook')
async def login_facebook(request: Request):
    redirect_uri = request.url_for('auth_facebook_callback')
    return await oauth.facebook.authorize_redirect(request, redirect_uri)

@router.get('/facebook/callback')
async def auth_facebook_callback(request: Request):
    try:
        token = await oauth.facebook.authorize_access_token(request)

        # Obtener info del usuario
        resp = await oauth.facebook.get(
            'https://graph.facebook.com/me?fields=id,name,email,picture'
        )
        user_info = resp.json()

        # Crear o actualizar usuario
        user = await get_or_create_user(
            email=user_info.get('email'),
            name=user_info.get('name'),
            picture=user_info.get('picture', {}).get('data', {}).get('url'),
            provider='facebook',
            provider_id=user_info['id']
        )

        # Generar JWT
        access_token = create_access_token({
            'sub': str(user.id),
            'email': user.email,
            'name': user.name
        })

        return RedirectResponse(
            url=f'{FRONTEND_URL}/app/dashboard?token={access_token}'
        )
    except Exception as e:
        print(f"Error en Facebook OAuth: {e}")
        return RedirectResponse(url=f'{FRONTEND_URL}/login?error=auth_failed')

# ============ INSTAGRAM ============
@router.get('/instagram')
async def login_instagram(request: Request):
    redirect_uri = request.url_for('auth_instagram_callback')
    return await oauth.instagram.authorize_redirect(request, redirect_uri)

@router.get('/instagram/callback')
async def auth_instagram_callback(request: Request):
    try:
        token = await oauth.instagram.authorize_access_token(request)

        # Obtener info del usuario
        resp = await oauth.instagram.get(
            'https://graph.instagram.com/me?fields=id,username,account_type'
        )
        user_info = resp.json()

        # Crear o actualizar usuario
        user = await get_or_create_user(
            email=None,  # Instagram no siempre da email
            name=user_info.get('username'),
            provider='instagram',
            provider_id=user_info['id']
        )

        # Generar JWT
        access_token = create_access_token({
            'sub': str(user.id),
            'name': user.name
        })

        return RedirectResponse(
            url=f'{FRONTEND_URL}/app/dashboard?token={access_token}'
        )
    except Exception as e:
        print(f"Error en Instagram OAuth: {e}")
        return RedirectResponse(url=f'{FRONTEND_URL}/login?error=auth_failed')
```

### 6. Función para Crear/Obtener Usuario

```python
# app/services/user_service.py
from app.models import User
from sqlalchemy.ext.asyncio import AsyncSession

async def get_or_create_user(
    db: AsyncSession,
    email: str = None,
    name: str = None,
    picture: str = None,
    provider: str = None,
    provider_id: str = None
):
    # Buscar usuario por provider_id
    user = await db.execute(
        select(User).where(
            User.provider == provider,
            User.provider_id == provider_id
        )
    )
    user = user.scalar_one_or_none()

    if user:
        # Actualizar información si cambió
        user.name = name
        user.picture = picture
        await db.commit()
        return user

    # Crear nuevo usuario
    user = User(
        email=email,
        name=name,
        picture=picture,
        provider=provider,
        provider_id=provider_id
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
```

### 7. Proteger Queries GraphQL

```python
# app/graphql/schema.py
import strawberry
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.utils.auth import verify_token

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials
    payload = verify_token(token)

    if not payload:
        raise HTTPException(status_code=401, detail="Token inválido")

    return payload

@strawberry.type
class Query:
    @strawberry.field
    async def user_diet_plan(
        self,
        info: strawberry.Info,
        user: dict = Depends(get_current_user)
    ) -> DietPlan:
        # Solo devuelve datos del usuario autenticado
        user_id = user['sub']
        return await get_diet_plan(user_id)
```

### 8. Registrar Router en FastAPI

```python
# app/main.py
from app.routers import auth

app = FastAPI()

# Registrar router de autenticación
app.include_router(auth.router)
```

---

## 🔑 Obtener Credenciales OAuth

### Google

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto
3. Habilita "Google+ API"
4. Crea credenciales OAuth 2.0
5. Añade redirect URI: `https://gorila360.es/auth/google/callback`

### Facebook

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una app
3. Añade "Facebook Login"
4. Configura redirect URI: `https://gorila360.es/auth/facebook/callback`

### Instagram

1. Ve a [Facebook Developers](https://developers.facebook.com/)
2. Crea una app
3. Añade "Instagram Basic Display"
4. Configura redirect URI: `https://gorila360.es/auth/instagram/callback`

---

## ✅ Checklist de Implementación

- [ ] Instalar dependencias (`authlib`, `python-jose`, `passlib`)
- [ ] Configurar variables de entorno
- [ ] Crear utilidades JWT (`create_access_token`, `verify_token`)
- [ ] Configurar OAuth para Google, Facebook, Instagram
- [ ] Crear endpoints `/auth/google`, `/auth/facebook`, `/auth/instagram`
- [ ] Crear callbacks para cada proveedor
- [ ] Implementar `get_or_create_user`
- [ ] Proteger queries GraphQL con `get_current_user`
- [ ] Obtener credenciales OAuth de cada proveedor
- [ ] Probar el flujo completo

---

## 🧪 Probar Localmente

```bash
# 1. Configurar ngrok para HTTPS local
ngrok http 8000

# 2. Usar la URL de ngrok en las redirect URIs de OAuth
# Ejemplo: https://abc123.ngrok.io/auth/google/callback

# 3. Actualizar .env con la URL de ngrok
FRONTEND_URL=https://abc123.ngrok.io
BACKEND_URL=https://abc123.ngrok.io
```

---

## 📚 Recursos

- [Authlib Documentation](https://docs.authlib.org/)
- [FastAPI OAuth2](https://fastapi.tiangolo.com/tutorial/security/oauth2-jwt/)
- [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Instagram Basic Display](https://developers.facebook.com/docs/instagram-basic-display-api)

---

## 🆘 Troubleshooting

### Error: "redirect_uri_mismatch"

- Verifica que la redirect URI en el código coincida exactamente con la configurada en el proveedor OAuth

### Error: "invalid_client"

- Verifica que CLIENT_ID y CLIENT_SECRET sean correctos

### Token no se decodifica

- Verifica que SECRET_KEY sea la misma en todo el backend

---

¡Buena suerte con la implementación! 🚀
