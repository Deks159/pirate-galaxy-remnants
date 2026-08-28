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


## Panel de análisis administrativo (V3.8)

El modo `super_admin` incorpora el botón **Análisis**. La sección carga el histórico completo
directamente desde Supabase en lotes de 1000 filas y calcula las métricas en el navegador.

Incluye tres áreas:

### Resumen
- Total de registros.
- Porcentaje con evidencia.
- Porcentaje asociado a ciclos.
- Cobertura y huecos en `cycle_position`.
- Cobertura de combinaciones comunes.
- Hallazgos automáticos y avisos sobre tamaño de muestra.

### Comunes / rotación
- Filtro `XC + SC`, solo `SC` o solo `XC`.
- Apariciones de cada combinación común.
- Intervalo promedio y mediano medido en apariciones de clase `Comunes` dentro del mismo ciclo.
- Cantidad de comunes desde la última aparición.
- Ranking de espera relativa (`actual / mediana histórica`), solo cuando hay al menos dos
  intervalos utilizables.
- Combinaciones que aparecen con mayor frecuencia antes y después de una combinación objetivo.
- `Cañón · Potente` queda seleccionado por defecto como objetivo inicial.

### Consultar combinación
Permite elegir tipo, clase, plano y tecnología para responder:
- Cuántas veces ha aparecido.
- Cuándo apareció por última vez.
- En cuántos ciclos aparece.
- Mediana de registros entre apariciones dentro de ciclos.
- Cuántos registros han pasado desde la última aparición en el ciclo actual.
- Posiciones concretas por ciclo.
- Vecinos anteriores y posteriores más observados.

El panel es descriptivo: no afirma conocer el algoritmo/RNG interno del juego. Las señales de
espera se acompañan del tamaño de muestra para evitar interpretar pocos intervalos como una
predicción fiable.

La V3.8 no requiere cambios de esquema ni migraciones nuevas en Supabase.


## Accesos privados al análisis (V3.9)

La V3.9 incorpora dos roles privados:

- `super_admin`: mantiene todas las capacidades administrativas y es el único que puede crear,
  banear, reactivar o eliminar cuentas de análisis.
- `analysis_viewer`: puede iniciar sesión y abrir el panel **Análisis**, pero no recibe el panel
  de usuarios ni los controles de reinicio, campos, exportación CSV, edición o eliminación
  administrativa.

El superadministrador dispone de un nuevo botón **Usuarios**. Desde allí puede:

- Crear una cuenta de analista indicando correo y nombre opcional.
- Obtener una contraseña temporal generada en el servidor. La contraseña no se almacena en las
  tablas de la aplicación y se muestra una sola vez.
- Consultar último acceso, IP, ubicación aproximada, número de IP y dispositivos recientes.
- Revisar hasta 100 eventos recientes por cuenta.
- Banear, reactivar o eliminar la cuenta.

### Auditoría y privacidad

Los accesos de `analysis_viewer` pasan por la Edge Function `analysis-access`. Se registran:

- IP pública observada por el servidor.
- País, región y ciudad **aproximados** derivados de la IP.
- Zona horaria aproximada de la IP.
- User-Agent.
- Identificador aleatorio persistente del navegador (`localStorage`), no una huella digital.
- Zona horaria e idioma reportados por el navegador.
- Fecha y tipo de evento.

No se solicita GPS ni coordenadas precisas. La ubicación aproximada se resuelve en el servidor mediante el servicio de geolocalización por IP `ipwho.is`; si el servicio no responde, el acceso sigue funcionando y la ubicación queda vacía. La pantalla de acceso informa al analista de este registro antes de iniciar sesión.

Las señales `Bajo`, `Medio` y `Alto` son indicadores de cambios de acceso, no una acusación de
cuenta compartida. VPN, CGNAT, redes móviles y viajes pueden producir varias IP o ubicaciones.

### Seguridad

Las operaciones de Auth Admin (`createUser`, `updateUserById`, `deleteUser`) se ejecutan únicamente
en la Edge Function. La clave secreta/service-role nunca se envía al navegador.

Las tablas `analysis_members` y `analysis_access_logs` tienen RLS activado, no conceden permisos a
`anon` ni `authenticated`, y sólo se acceden desde código de servidor.

Un analista bloqueado se revalida al iniciar la aplicación, al abrir/actualizar Análisis y mediante
una verificación periódica mientras el panel está abierto. Esto reduce la ventana de uso de un JWT
ya emitido tras un baneo.

### Archivos de servidor

El repositorio incluye:

`supabase/functions/analysis-access/index.ts`

La Edge Function V3.9 ya fue desplegada al proyecto conectado y la migración de base ya fue
aplicada. Al publicar V3.9 en GitHub Pages no es necesario volver a ejecutar `schema.sql`.


## V4.0 · identificación de piloto y nuevo comportamiento XC

Al acceder con una sesión anónima, el panel solicita obligatoriamente el nombre de piloto antes de permitir el uso del panel público. El valor se conserva en `sessionStorage` durante esa sesión y cada registro anónimo agrega automáticamente `extra_data.pilot_name`. El campo dinámico `pilot_name` deja de mostrarse a usuarios anónimos para evitar captura duplicada.

Los XC nuevos ya no usan el catálogo tradicional de planos/tecnologías. El formulario XC permite seleccionar `Mejora de aleación`, `Mejora estela de motor` o `Mejora ranura de componente`, y pide un texto libre con el detalle exacto observado. Para conservar el esquema actual, el tipo de mejora se guarda en `class_name`, el detalle libre en `blueprint` y `technology` se guarda internamente como `Normal` (la interfaz muestra `—`). Los XC históricos permanecen intactos y SC conserva clase → plano → tecnología.

La consulta de análisis admite también los XC modernos y carga los detalles observados desde el histórico. No se requiere migración nueva de Supabase para esta versión.


## Apariciones no destruidas (V4.1)

Hay remanentes que se observan pero se dejan pasar sin destruirlos. Esos eventos son importantes
para reconstruir la rotación, aunque no exista un drop confirmado.

El formulario incorpora **Resultado de la aparición**:

- `Destruido / confirmado`: flujo normal. SC registra clase, plano y tecnología; XC registra tipo de mejora y detalle.
- `Se dejó pasar`: registra únicamente lo que realmente se conoce.
  - SC: tipo de remanente + clase visible (por ejemplo `Tormenta`).
  - XC: tipo de remanente + tipo de mejora/componente identificable.
  - `blueprint` y `technology` quedan `NULL`; no se inventa información.

En base de datos se usa `observation_status` con `confirmed` o `passed`. Todos los registros anteriores
quedan automáticamente como `confirmed`.

Los eventos `passed` reciben `cycle_position` exactamente igual que los destruidos, por lo que cuentan
como una aparición dentro de la secuencia. El panel de análisis los incluye en el total y en la secuencia,
pero los excluye de cálculos que requieren un plano/tecnología exactos. Así una aparición que se dejó pasar
no se convierte artificialmente en un hueco de la rotación.

La prevención de duplicados de 1 hora también se aplica a las apariciones no destruidas usando
`resultado + tipo + clase/tipo conocido`. El superadministrador conserva su excepción.

La migración V4.1 ya fue aplicada al proyecto Supabase conectado. No ejecutes `supabase/schema.sql`
manualmente al publicar esta versión.
