# Remnant Log · Pirate Galaxy

Web estática para registrar y consultar Remanentes de Pirate Galaxy.

## Funciones

- Registro de tipo de remanente: **XC / SC**.
- Catálogo por **clase**, **plano** y **tecnología**.
- Fecha y hora mostrada con la zona `Europe/Madrid`.
- Evidencia fotográfica opcional.
- Compresión automática de imágenes a WebP antes de guardarlas.
- Historial con filtros.
- Exportación a CSV.
- Persistencia local usando **IndexedDB**.
- Diseño responsive para escritorio y móvil.
- No requiere framework ni instalación de dependencias.

## Ejecutar en local

Puedes abrir `index.html` directamente, aunque es mejor servir la carpeta con un servidor web.

Con Python:

```bash
python -m http.server 8080
```

Después abre:

```text
http://localhost:8080
```

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub.
2. Sube estos archivos a la raíz del repositorio:
   - `index.html`
   - `styles.css`
   - `app.js`
3. En GitHub entra a **Settings > Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda los cambios.

GitHub publicará el sitio como una página web estática.

## Importante sobre los datos

Esta versión está pensada como prototipo funcional para GitHub Pages. Los registros y las imágenes se almacenan en **IndexedDB del navegador actual**.

Eso significa:

- Si registras datos desde PC A, no aparecerán automáticamente en PC B.
- Borrar los datos del navegador puede borrar los registros.
- GitHub Pages no proporciona una base de datos ni un backend.
- Las fotos **no se suben al repositorio GitHub**; permanecen localmente en el navegador.

Para que los datos sean compartidos entre usuarios/dispositivos y para utilizar una hora de servidor real, el siguiente paso es conectar el frontend a un backend y una base de datos (por ejemplo PostgreSQL + almacenamiento S3).

## Hora de España

Los timestamps se almacenan como instantes ISO/UTC y se presentan usando:

```text
Europe/Madrid
```

Esto maneja automáticamente UTC+1/UTC+2 según el horario de verano de España.
