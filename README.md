# Pirate Galaxy · Remnant Log

Aplicación web para registrar Remanentes de Pirate Galaxy usando GitHub Pages + Supabase.

## Arquitectura

- GitHub Pages: frontend.
- Supabase Auth: sesión anónima para operadores y login Email/Password para superusuario.
- Supabase PostgreSQL: historial.
- Supabase Storage: evidencias.
- RLS: autorización de lectura/escritura.

## Funciones

### Usuario normal

- Registrar XC / SC.
- Elegir clase, plano y tecnología.
- Todos los planos incluyen `Normal`.
- Guardar campos dinámicos, actualmente `Nombre de piloto`.
- Subir evidencia.
- Consultar historial.
- Exportar CSV.

### Superusuario

El superusuario inicia sesión con correo/contraseña y debe tener:

```json
{
  "role": "super_admin"
}
```

dentro de `app_metadata`.

Puede:

- Agregar registros manualmente usando el mismo formulario.
- Editar registros.
- Eliminar registros.
- Reemplazar o eliminar evidencia.
- Crear campos nuevos del formulario.
- Editar campos.
- Activar/desactivar campos.
- Eliminar definiciones de campos.

Cuando se elimina una definición de campo, los valores ya guardados en `remnant_records.extra_data` permanecen en el historial.

## Campo dinámico

Los campos adicionales se definen en:

```text
public.form_fields
```

y sus valores se guardan en:

```text
public.remnant_records.extra_data
```

Ejemplo:

```json
{
  "pilot_name": "Deks159",
  "clan": "Ejemplo"
}
```

Esto permite ampliar el formulario sin agregar una columna nueva por cada campo.

## Crear el superusuario

1. En Supabase Dashboard abre `Authentication > Users`.
2. Crea el usuario con correo y contraseña.
3. Después asigna en `raw_app_meta_data` / `app_metadata` el rol `super_admin`.
4. Cierra cualquier sesión anterior del usuario y vuelve a iniciar sesión para obtener un JWT actualizado.

No uses `user_metadata` para autorización.

## Base de datos

`supabase/schema.sql` contiene el estado reproducible del esquema.

El backend remoto ya tiene aplicada la ampliación de:

- `extra_data`
- `updated_at`
- `updated_by`
- tabla `form_fields`
- políticas de superusuario
- índice de `created_by`

## Publicación

GitHub Pages puede continuar desplegando desde:

```text
main / (root)
```


## Paginación del historial (V3.2)

- `Últimos registros`: consulta independiente con los 6 más recientes.
- `Historial`: paginación real desde Supabase, 20 registros por página por defecto.
- Tamaños disponibles: 20, 50 o 100 registros por página.
- Los filtros y la búsqueda se aplican en Supabase antes de paginar.
- Las métricas se calculan con consultas de conteo y no dependen de la página visible.
- La exportación CSV obtiene todos los registros que coinciden con los filtros, no solo la página actual.
- `@supabase/supabase-js` está fijado en `2.111.0` en el CDN.


## Exportación CSV restringida en interfaz (V3.3)

- El botón `Exportar CSV` inicia oculto.
- Solo se muestra cuando la sesión actual tiene `app_metadata.role = super_admin`.
- Al cerrar la sesión administrativa, el botón vuelve a ocultarse.
- `exportCsv()` también verifica `isSuperAdmin()` antes de generar el archivo.
- Esta segunda validación evita que un usuario normal exporte simplemente mostrando el botón con DevTools.
- La restricción sigue siendo del lado del cliente; los usuarios normales conservan acceso de lectura al historial porque la aplicación necesita mostrarlo.


## Ciclos de servidor (V3.4)

La aplicación ahora puede separar la rotación de remanentes por reinicios del servidor.

### Flujo
1. El superusuario entra en modo Admin.
2. Pulsa `Reinicio`.
3. Registra servidor, uptime, hora mostrada por Game Info y una captura de evidencia.
4. Supabase crea un nuevo `cycle_number`.
5. Cada nuevo remanente se asocia automáticamente al ciclo vigente.
6. La base asigna también `cycle_position` de forma consecutiva: 1, 2, 3, etc.

Los registros anteriores al primer reinicio permanecen como `Sin ciclo`; no se retroasignan porque no existe evidencia suficiente para saber a qué lista pertenecían.

### Base de datos
- Nueva tabla: `public.server_restarts`.
- Nuevas columnas en `public.remnant_records`:
  - `server_restart_id`
  - `cycle_position`
- Un trigger de PostgreSQL asigna ciclo y posición al insertar cada remanente.
- El registro de reinicios requiere `super_admin`.
- Todos los usuarios autenticados, incluidos los anónimos de la app, pueden leer el ciclo actual y su evidencia.


### Estado del proyecto conectado

La migración V3.4 ya fue aplicada al proyecto Supabase conectado. Al actualizar GitHub Pages
no es necesario volver a ejecutar `supabase/schema.sql`; ese archivo se conserva como referencia
reproducible del esquema.


## Catálogo corregido (V3.5)

Se actualizó el catálogo de planos y tecnologías exactamente a la tabla validada para el juego.

La aplicación ahora distingue las etiquetas tal como corresponden a cada plano:
- `Rápido` y `Rápida`
- `Duradero` y `Duradera`
- `Potente`
- `Normal`

`Normal` continúa agregándose automáticamente a todos los planos. `Recolector` conserva únicamente `Normal`.

La restricción `remnant_records_technology_check` de Supabase fue ampliada para aceptar las seis
etiquetas anteriores. La migración ya fue aplicada al proyecto conectado.

La V3.5 no reescribe automáticamente registros históricos: un registro previo conserva exactamente
la tecnología con la que fue guardado para no alterar evidencia histórica sin revisión.


## Protección contra registros duplicados (V3.7)

Para evitar que varias personas anoten el mismo remanente, se valida la combinación de:

- Tipo de remanente (`XC` / `SC`)
- Clase
- Plano
- Tecnología

### Usuarios normales

La misma combinación queda bloqueada durante **1 hora dentro del mismo ciclo del servidor**.
Si el servidor se reinicia y comienza un ciclo nuevo, la combinación puede registrarse nuevamente
sin esperar la hora.

La protección funciona en dos niveles:

1. **Frontend:** antes de subir la evidencia, la página consulta si el remanente ya fue registrado
   durante la última hora.
2. **PostgreSQL:** un trigger vuelve a validar el INSERT y rechaza el duplicado con SQLSTATE `23P01`.
   El trigger se ejecuta después de la asignación automática del ciclo, por lo que también cubre
   intentos casi simultáneos de diferentes usuarios.

### Superusuario

El usuario con `app_metadata.role = super_admin` puede registrar la misma combinación antes de
cumplirse la hora cuando confirma que realmente volvió a salir. La excepción se valida también en
PostgreSQL; no depende únicamente de ocultar o mostrar controles del frontend.

La V3.7 también mantiene `created_at` asignado desde PostgreSQL y agrega un índice compuesto para
acelerar la búsqueda de duplicados por ciclo + tipo + clase + plano + tecnología + fecha.

La migración V3.7 ya fue aplicada al proyecto Supabase conectado. Al publicar esta versión en
GitHub Pages **no ejecutes `supabase/schema.sql` manualmente**; se conserva como referencia del
esquema reproducible.
