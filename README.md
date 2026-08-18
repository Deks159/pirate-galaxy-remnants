# Pirate Galaxy · Remnant Log

## Estado actual

- Supabase: `Deks159's Project`
- Project ref: `rpeixlqgwkdsjmobppbt`
- Región: `us-west-2`
- Tabla: `public.remnant_records`
- Bucket privado: `remnant-evidence`
- RLS: habilitado
- Security Advisors: sin hallazgos
- `created_at`: generado por PostgreSQL mediante `now()`
- Frontend: ya configurado con Project URL + publishable key

## Arquitectura

- GitHub: repositorio del código.
- GitHub Pages: hosting de la web.
- Supabase PostgreSQL: historial central.
- Supabase Storage: evidencias.
- Supabase Auth anónimo: sesión automática para aplicar RLS sin pedir login al jugador.

## Configuración

1. Crea un proyecto en Supabase.
2. En Authentication habilita Anonymous Sign-Ins.
3. Abre SQL Editor y ejecuta `supabase/schema.sql`.
4. Copia Project URL y Publishable/Anon key en `config.js`.
5. Sube el contenido a GitHub.
6. Activa GitHub Pages desde `main` y `/(root)`.

## Hora del registro

`created_at` se genera con `default now()` en PostgreSQL. El navegador no decide la fecha del registro. La interfaz transforma ese instante a `Europe/Madrid`, que gestiona automáticamente UTC+1/UTC+2 según horario de verano.

## Seguridad

La web utiliza únicamente la Publishable/Anon key. Nunca coloques `service_role` o Secret keys en GitHub Pages. RLS está habilitado. El historial es compartido entre sesiones autenticadas y las evidencias están en un bucket privado.
