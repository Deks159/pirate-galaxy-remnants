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
