# Herramienta de Autoevaluación - Liderazgo Servidor en la Escuela Católica

**Autor:** Dr. Raúl R. Nieves Rivera

Aplicación web interactiva para evaluar prácticas de liderazgo servicial en instituciones educativas católicas.

---

## 📋 Características

- ✅ Formulario interactivo de 20 preguntas distribuidas en 5 dimensiones
- ✅ Cálculo automático de puntajes total y por dimensión
- ✅ Interpretación orientativa basada en resultados
- ✅ Visualización de fortalezas y áreas de mejora
- ✅ Captura de nombre y email antes de mostrar resultados completos
- ✅ Almacenamiento automático en Google Sheets
- ✅ Generación de PDF con resultados
- ✅ Sección de reflexión personal
- ✅ Diseño profesional responsivo (azul business)

---

## 🚀 Instalación y Configuración

### Paso 1: Preparar los archivos

Todos los archivos del proyecto están en la carpeta `liderazgo-servidor/`:

```
liderazgo-servidor/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   ├── calculator.js
│   └── sheets.js
├── google-apps-script.js
└── README.md
```

### Paso 2: Configurar Google Sheets

#### 2.1 Crear la hoja de cálculo

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Nómbrala: **"Liderazgo Servidor - Respuestas"**

#### 2.2 Configurar Google Apps Script

1. En tu Google Sheet, ve a **Extensiones** → **Apps Script**
2. Elimina el código por defecto
3. Abre el archivo `google-apps-script.js` en tu computadora
4. Copia todo el contenido y pégalo en el editor de Apps Script
5. Haz clic en **💾 Guardar** (Ctrl+S)

#### 2.3 Hacer el Deploy como Web App

1. En Apps Script, haz clic en **Deploy** → **New deployment**
2. Haz clic en el ícono de engranaje ⚙️ junto a "Select type"
3. Selecciona **Web app**
4. Configura:
   - **Description:** "Liderazgo Servidor API"
   - **Execute as:** **Me** (tu cuenta)
   - **Who has access:** **Anyone**
5. Haz clic en **Deploy**
6. Autoriza la aplicación (puede que te pida permisos)
7. **COPIA LA URL** que aparece (se ve así: `https://script.google.com/macros/s/ABC123.../exec`)

#### 2.4 Conectar la Web App con el formulario

1. Abre el archivo `js/sheets.js`
2. Busca la línea 8:
   ```javascript
   SCRIPT_URL: 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE',
   ```
3. Reemplázala con tu URL copiada:
   ```javascript
   SCRIPT_URL: 'https://script.google.com/macros/s/TU_URL_AQUI/exec',
   ```
4. Guarda el archivo

---

### Paso 3: Deployment en GitHub Pages

#### 3.1 Crear repositorio en GitHub

1. Ve a [GitHub](https://github.com) e inicia sesión
2. Haz clic en **New repository** (botón verde)
3. Configura:
   - **Repository name:** `liderazgo-servidor`
   - **Description:** "Herramienta de Autoevaluación - Liderazgo Servidor"
   - **Visibility:** Public
4. Haz clic en **Create repository**

#### 3.2 Subir archivos

Opción A - **Via web (más fácil):**

1. En tu nuevo repositorio, haz clic en **Add file** → **Upload files**
2. Arrastra TODOS los archivos y carpetas del proyecto:
   - `index.html`
   - carpeta `css/`
   - carpeta `js/`
3. Escribe un mensaje: "Initial commit"
4. Haz clic en **Commit changes**

Opción B - **Via Git (más profesional):**

```bash
cd liderazgo-servidor
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/liderazgo-servidor.git
git push -u origin main
```

#### 3.3 Activar GitHub Pages

1. En tu repositorio, ve a **Settings** (Configuración)
2. En el menú lateral, haz clic en **Pages**
3. En **Source**, selecciona:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
4. Haz clic en **Save**
5. Espera 1-2 minutos
6. Tu sitio estará disponible en: `https://TU_USUARIO.github.io/liderazgo-servidor/`

---

## 🎨 Personalización

### Cambiar colores

Edita las variables CSS en `css/styles.css` (líneas 6-16):

```css
:root {
    --primary: #2563eb;        /* Azul principal */
    --primary-dark: #1e40af;   /* Azul oscuro */
    --accent: #0ea5e9;         /* Azul acento */
    /* ... más colores ... */
}
```

### Cambiar tipografía

1. Ve a [Google Fonts](https://fonts.google.com)
2. Selecciona una fuente
3. Actualiza el `<link>` en `index.html` (línea 8)
4. Actualiza `--font-family` en `css/styles.css` (línea 26)

---

## 📊 Uso de Google Sheets

### Hojas creadas automáticamente

El script crea dos hojas:

1. **Respuestas** - Resumen con puntajes por dimensión
2. **Respuestas Detalladas** - Respuestas individuales a las 20 preguntas

### Crear Dashboard de Resumen (Opcional)

1. Ve a tu Google Sheet
2. Ve a **Extensiones** → **Apps Script**
3. En la consola de Apps Script, escribe:
   ```javascript
   createSummaryDashboard()
   ```
4. Presiona Enter
5. Esto creará una hoja "Dashboard" con estadísticas agregadas

---

## 🔧 Solución de Problemas

### Los datos no se guardan en Google Sheets

1. Verifica que la URL en `js/sheets.js` sea correcta
2. Asegúrate de que el deployment esté configurado como "Anyone" puede acceder
3. Abre la consola del navegador (F12) y busca errores
4. Prueba la conexión ejecutando en la consola:
   ```javascript
   SheetsIntegration.testConnection()
   ```

### El formulario no se ve bien en móvil

- El diseño es responsivo por defecto
- Verifica que el archivo `css/styles.css` esté cargando correctamente
- Revisa la consola del navegador (F12) para errores de carga

### El PDF no se genera

1. Verifica que el script de jsPDF esté cargando (línea 384 de `index.html`)
2. Asegúrate de que JavaScript esté habilitado en el navegador
3. Prueba en un navegador diferente (Chrome/Firefox/Edge)

---

## 📧 Funcionalidades Futuras

- ✅ Implementado: Generación de PDF
- 🔄 En desarrollo: Envío automático de resultados por email
- 📋 Planeado: Comparación de resultados a lo largo del tiempo
- 📊 Planeado: Análisis grupal e institucional

---

## 📄 Estructura de Datos en Google Sheets

### Hoja "Respuestas"
| Columna | Descripción |
|---------|-------------|
| A | Timestamp ISO |
| B | Fecha (DD/MM/YYYY) |
| C | Hora (HH:MM:SS) |
| D | Nombre |
| E | Email |
| F | Puntaje Total (0-100) |
| G | Interpretación |
| H | Categoría |
| I-M | Puntajes por dimensión (0-20 cada uno) |
| N-Q | Análisis (fortalezas y áreas de mejora) |

### Hoja "Respuestas Detalladas"
| Columna | Descripción |
|---------|-------------|
| A | Timestamp |
| B | Nombre |
| C | Email |
| D-W | Respuestas individuales Q1-Q20 (1-5) |
| X | Puntaje Total |

---

## 🛡️ Seguridad y Privacidad

- Los datos se almacenan en tu Google Sheet personal
- No hay backend externo - todo corre en el navegador del usuario
- Google Apps Script requiere autorización explícita
- Los datos NO se comparten con terceros
- Recomendado: Configura permisos de visualización de tu Google Sheet

---

## 👨‍💻 Soporte Técnico

Para preguntas o asistencia:
- Email: [Tu email de contacto]
- Issues: GitHub Issues en este repositorio

---

## 📜 Licencia

Esta herramienta es propiedad intelectual del **Dr. Raúl R. Nieves Rivera**.

Desarrollado con ❤️ para la comunidad educativa católica.

---

## 🙏 Reconocimientos

- Diseñado por: Guillermo A. Núñez Salgado (EdTech Believers LLC)
- Autor de la herramienta: Dr. Raúl R. Nieves Rivera
- Inspirado en las mejores prácticas de liderazgo servicial en educación católica
