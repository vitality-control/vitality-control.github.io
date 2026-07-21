# CLAUDE.md — Portal Operativo LiTa Support · Vitality Kitchen

## Qué es este repo
Portal operativo de control de turnos, checklists, evidencia fotográfica y alertas para **Vitality Kitchen**, operado bajo la marca **LiTa Support**. Producción en GitHub Pages. Este portal es una **instancia de un modelo replicable**: de este sistema saldrán más portales para nuevos clientes en cualquier momento — todo cambio debe pensarse como mejora de plantilla, no como hack puntual.

## REGLAS DE TRABAJO (obligatorias)
1. **Antes de cualquier cambio, preguntar a Mario si aplica a ambas plataformas o solo a una.** Repo hermano: `cdjsupport/cdjsupport.github.io`. Si aplica a ambos, replicar el cambio idéntico (solo cambian colores/marca).
2. **Marca**: Vitality Kitchen. El portal puede mostrar "vitality kitchen · Portal Operativo". La marca operadora visible es LiTa Support.
3. **NUNCA commitear sin verificar:** `node --check` sobre el script principal extraído de portal.html + QA headless completo (ver Protocolo QA).
4. **Nunca editar ESTRUCTURA con regex/replaces ciegos** — un elemento undefined en ese array rompe TODO el render post-login (incidente real: coma huérfana dejó pantalla blanca en producción).
5. Timezone SIEMPRE `America/Mexico_City` (formato fecha: `toLocaleDateString('en-CA',{timeZone:'America/Mexico_City'})`).
6. Secretos (tokens, service keys, passwords) NUNCA en este repo — es público. Pedirlos a Mario.

## Arquitectura
- **`portal.html`** (~400KB single-file): toda la app. CSS al inicio (incluye capa "REDESIGN 2026" y fixes de sidebar), JS en un `<script>` gigante al final.
- **`vk-sb-init.js`**: cliente Supabase + sync multi-dispositivo (sbUpsertProgreso/sbDownProgreso a tabla `progreso_modulos` con onConflict fecha,modulo_id; sbInsertAlerta con anti-spam 1/día/contexto).
- **Supabase** (proyecto `nivloptdmunxtokyddlj`): PostgreSQL + RLS + Storage.
- **Edge Function `vk-send-alert`** (Deno, verify_jwt:false): trigger on_alerta_insert → pg_net → email premium vía Resend a los destinatarios.
- **Colores de marca**: primario `#146B4F`, acento `#4ADE80`. Tipografía del portal: DM Sans / DM Mono.

## Tablas del servidor
- `colaboradores` — auth bcrypt server-side. NO legible por anon; acceso vía RPCs `rpc_login(p_email,p_pass)`, `rpc_validar_pin(p_pin)`, `rpc_upsert_colaborador(p_admin_key,...)`.
- `turno_estado` — PK (fecha, turno_tipo). Apertura/cierre cross-device.
- `progreso_modulos` — PK (fecha, modulo_id). Sync de checklists entre dispositivos.
- `alertas` — INSERT dispara trigger → Edge Function → email. Campo modulo_id se usa como flag global (ej. `reporte-semanal-2026-S30`).
- `fotos` + Storage bucket `fotos-operativas`.

## Sistemas implementados
- **Login**: server-side (rpc_login bcrypt) con fallback local (seed en portal.html, sección USUARIOS).
- **Scoring**: MOD_PESOS + MOD_CRITICOS → calcScoreArea/calcScoreGlobal → letras A+ a D.
- **Sync multi-device**: launchApp → getTurnoActivoServidor + sbDownProgreso + interval 60s. Merge: server solo pisa si su pct es mayor.
- **Evidencia fotográfica v3**: motivo OBLIGATORIO + tipo (cumplimiento/hallazgo/incidencia) + watermark forense estampado en canvas + hallazgo/incidencia → alerta automática + **ciclo de corrección 2h** (vk_correcciones en localStorage, checkCorrecciones en interval, escala a alerta crítica si vence) + galería con filtros + muro semanal antes/después + dictado por voz (Web Speech es-MX).
- **QR por estación**: Supervisor → Códigos QR (api.qrserver.com). Deep links `?go=<cat>|<sub>` procesados por procesarDeepLink() con flag window._deepLinked (el sync NO debe pisar el deeplink).
- **Firma de cierre**: canvas táctil en modal de cierre → Storage + PDF del turno.
- **Reporte semanal**: checkReporteSemanal() — lunes/martes, flag global en alertas.modulo_id, consolida 7 días y envía email.
- **Recursos & Gestión**: Notas y Avisos activos; Capacitaciones/Auditorías/Evaluaciones/Infografías con candado "Próximamente" (por construir).

## Protocolo QA (antes de cada push)
```bash
npm install puppeteer --no-save
# 1. node --check sobre el <script> más largo extraído de portal.html
# 2. QA funcional: login real + navegar los 44 módulos (showSub por cada sub de ESTRUCTURA
#    + showHome/showSupervisor/showAlerts) en viewport 390x844 — 0 pageerrors exigido
# 3. Si se tocó sync/turnos: test de concurrencia con 2 browsers simultáneos
```
Credenciales de prueba: pedir a Mario (unificadas para ambos portales).

## Replicación para NUEVO cliente (checklist)
1. Nuevo repo GitHub Pages `<cliente>.github.io` — copiar portal.html + vk-sb-init.js del repo más actualizado.
2. Nuevo proyecto Supabase: correr el SQL de tablas + RLS + RPCs + trigger de alertas (pedir schema a Mario o extraer del proyecto existente).
3. Edge Function send-alert con los emails del nuevo cliente + Resend key.
4. Buscar/reemplazar branding: nombre, color primario, color acento, logo SVG del auth, favicon.
5. Ajustar ESTRUCTURA a las áreas reales del cliente (¡con cuidado — ver Regla 4!).
6. Seed colaboradores vía rpc_upsert_colaborador (nombres SIN apellidos corporativos si es superficie cliente).
7. QA completo + credenciales al cliente.

## Roadmap pendiente (priorizado por Mario)
1. Módulos bloqueados: Capacitaciones (manuales de 15 días ya existen), Auditorías (metodología RACREAA), Evaluaciones, Infografías.
2. Panel maestro LiTa multi-cliente (cockpit de Mario).
3. Onboarding de cliente nuevo en 1 hora (automatizar el checklist de arriba).
4. Reporte mensual ejecutivo PDF.
5. Ranking/gamificación del equipo.
6. WhatsApp Meta Cloud API (triggers listos, falta login de Meta de Mario).
