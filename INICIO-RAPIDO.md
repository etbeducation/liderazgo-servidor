# 🚀 GUÍA DE INICIO RÁPIDO
## Herramienta de Autoevaluación - Liderazgo Servidor

### ⏱️ Setup en 15 minutos

---

## PASO 1: Google Sheets (5 minutos)

1. **Crear Google Sheet:**
   - Ve a https://sheets.google.com
   - Crea nueva hoja: "Liderazgo Servidor - Respuestas"

2. **Configurar Apps Script:**
   - En la hoja: **Extensiones** → **Apps Script**
   - Borra el código
   - Abre `google-apps-script.js`
   - Copia TODO y pégalo
   - Guarda (Ctrl+S)

3. **Deploy Web App:**
   - Click **Deploy** → **New deployment**
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**
   - **COPIA LA URL** (guárdala en un notepad)

4. **Conectar al formulario:**
   - Abre `js/sheets.js`
   - Línea 8: Pega tu URL copiada
   - Guarda el archivo

---

## PASO 2: GitHub Pages (5 minutos)

1. **Crear repo:**
   - Ve a https://github.com/new
   - Name: `liderazgo-servidor`
   - Visibility: **Public**
   - Create repository

2. **Subir archivos:**
   - Click **Add file** → **Upload files**
   - Arrastra TODA la carpeta `liderazgo-servidor`
   - Commit changes

3. **Activar Pages:**
   - Settings → Pages
   - Source: **main** branch, **/ (root)** folder
   - Save
   - ¡Listo! Tu URL será: `https://TU_USUARIO.github.io/liderazgo-servidor/`

---

## PASO 3: Probar (2 minutos)

1. Espera 1-2 minutos a que GitHub Pages publique
2. Visita tu URL
3. Completa una prueba rápida
4. Verifica que los datos aparezcan en tu Google Sheet

---

## ✅ CHECKLIST RÁPIDO

- [ ] Google Sheet creado
- [ ] Apps Script configurado y deployed
- [ ] URL de Apps Script copiada en `js/sheets.js`
- [ ] Repositorio de GitHub creado
- [ ] Archivos subidos a GitHub
- [ ] GitHub Pages activado
- [ ] Prueba completada exitosamente

---

## 🆘 PROBLEMAS COMUNES

### "Los datos no se guardan"
→ Verifica que la URL en `js/sheets.js` sea la correcta (debe terminar en `/exec`)

### "GitHub Pages no muestra el sitio"
→ Espera 2-3 minutos. Luego recarga con Ctrl+F5

### "Error de CORS en Google Sheets"
→ Asegúrate que el deployment sea "Anyone" en Who has access

---

## 🎯 URLs IMPORTANTES

**Tu formulario en vivo:**
`https://TU_USUARIO.github.io/liderazgo-servidor/`

**Tu Google Sheet:**
`https://docs.google.com/spreadsheets/d/TU_ID/edit`

**Apps Script:**
`https://script.google.com/home/projects/TU_ID/edit`

---

## 📞 Siguiente Paso

Una vez todo funcione:
- Comparte la URL del formulario con tus usuarios
- Monitorea las respuestas en tu Google Sheet
- Usa la función `createSummaryDashboard()` para ver estadísticas

---

**¿Necesitas ayuda?** Revisa el README.md completo para más detalles.

✨ Desarrollado para Dr. Raúl R. Nieves Rivera
🛠️ Por Guillermo A. Núñez Salgado - EdTech Believers LLC
