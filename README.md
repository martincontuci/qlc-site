# QLC — Que Le Compramos | Website

Landing page institucional de [quelecompramos.com](https://quelecompramos.com).

Sitio estático HTML/CSS puro. Sin dependencias, sin build step, sin Node.
Se despliega en Vercel directamente desde este repositorio.

---

## Estructura de archivos

```
qlc-site/
├── index.html        — Landing page principal
├── privacidad.html   — Política de privacidad
├── contacto.html     — Formulario de contacto
├── styles.css        — Estilos compartidos (mobile-first)
└── README.md         — Este archivo
```

---

## Configuración pendiente antes de publicar

### 1. Reemplazar el número de WhatsApp
En los tres archivos HTML, buscá todas las ocurrencias de:
```
https://wa.me/TUNUMERO
```
Y reemplazalas por tu número real con código de país, sin el `+`:
```
https://wa.me/5491112345678
```
Hay 4 CTAs en `index.html` (hero, pasos, pricing x2) y 1 en `contacto.html` si querés agregar uno.

### 2. Verificar el email de contacto
El email `hola@quelecompramos.com` aparece en footer, privacidad y contacto.
Asegurate de que ese buzón esté activo antes de publicar.

### 3. Formulario de contacto (producción)
El formulario actual abre el cliente de email del usuario vía `mailto:`.
Para producción, reemplazar con [Formspree](https://formspree.io) (gratis hasta 50 envíos/mes):

1. Crear cuenta en formspree.io
2. Crear un nuevo formulario, copiar el endpoint (ej. `https://formspree.io/f/xyzabc`)
3. En `contacto.html`, reemplazar la función `handleSubmit()` con:

```javascript
async function handleSubmit() {
  const email   = document.getElementById('email').value.trim();
  const mensaje = document.getElementById('mensaje').value.trim();
  if (!email || !mensaje) { alert('Completá email y mensaje.'); return; }

  const data = {
    nombre:  document.getElementById('nombre').value,
    email,
    motivo:  document.getElementById('motivo').value,
    mensaje
  };

  const res = await fetch('https://formspree.io/f/TUENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (res.ok) {
    document.getElementById('form-success').style.display = 'block';
  } else {
    alert('Hubo un error. Por favor escribinos a hola@quelecompramos.com');
  }
}
```

---

## Deploy en Vercel (paso a paso)

### Crear el repositorio en GitHub

```bash
# Desde la carpeta del sitio
git init
git add .
git commit -m "Phase 5.1 - QLC website initial build"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/qlc-site.git
git push -u origin main
```

> Creá el repositorio vacío en github.com antes del último paso.
> Nombre sugerido: `qlc-site`
> Repo separado del backend (`gift-agent/gift-agent`). ✅

### Conectar con Vercel

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Importar el repositorio `qlc-site` desde GitHub
3. En la pantalla de configuración:
   - **Framework Preset:** `Other` (sitio estático, sin framework)
   - **Build Command:** dejar vacío
   - **Output Directory:** dejar vacío (o escribir `.`)
   - **Install Command:** dejar vacío
4. Click **Deploy**

Vercel detecta automáticamente el `index.html` en la raíz y publica el sitio.

### Conectar el dominio quelecompramos.com

1. En Vercel → tu proyecto → **Settings → Domains**
2. Agregar `quelecompramos.com` y `www.quelecompramos.com`
3. Vercel te da los registros DNS a agregar en tu registrar:
   - Registro `A` apuntando a la IP de Vercel
   - Registro `CNAME` para `www`
4. Una vez propagados (~5 min a 48hs según el registrar), el sitio estará en producción con HTTPS automático.

### Deploy automático

Cada vez que hagas `git push` a `main`, Vercel redespliega automáticamente. Sin pasos extra.

---

## Repositorios del proyecto

| Repo | Contenido | URL |
|------|-----------|-----|
| `gift-agent/gift-agent` | Backend WhatsApp (Flask + Railway) | privado |
| `TU_USUARIO/qlc-site` | Este sitio web | público |

---

## Commit convention (igual que el backend)

```
git commit -m "Phase 5.1 - descripción del cambio"
```

Ejemplos:
- `"Phase 5.1 - QLC website initial build"`
- `"Phase 5.1 - replace WhatsApp number with live Twilio number"`
- `"Phase 5.1 - add Formspree to contact form"`
