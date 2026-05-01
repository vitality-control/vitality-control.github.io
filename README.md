# Vitality Kitchen — Ecosistema Operativo

**DMZA SaaS** · ERP F&B Multi-Tenant · Powered by DMZ · LiTa Support

---

## Qué es esto

Ecosistema B2B de control operativo, financiero y de inocuidad para restaurantes. Cliente MVP: **Vitality Kitchen** (Puebla, México).

Unifica la flexibilidad de un constructor de formularios, el hábito de una app de piso, el rigor de planes de acción, y la inteligencia financiera de un ERP — todo enfocado a F&B.

## Estructura del repositorio

```
├── app/
│   ├── Vitality_Kitchen_Ecosistema_Completo.html   ← Demo interactiva (abrir en navegador)
│   ├── vitality_ecosystem_completo.jsx              ← Componente React completo
│   ├── vitality_hub.jsx                             ← Hub operativo + pantalla de cobro
│   └── dmz_security_section.jsx                     ← Sección web de seguridad DMZ
├── docs/
│   └── DMZA_Vitality_Kitchen_Resumen_Proyecto.docx  ← Resumen ejecutivo v0.9.0
├── brand/
│   └── (brand guidelines, logos, isotipos)
└── README.md
```

## Demo rápida

1. Descarga `Vitality_Kitchen_Ecosistema_Completo.html`
2. Ábrelo en cualquier navegador (Safari, Chrome, Firefox)
3. Flujo: Login MFA → Pago Stripe → Hub 9 áreas → Checklists → Bitácoras

## Módulos implementados

| Módulo | Estado | Descripción |
|--------|--------|-------------|
| Gatekeeper / Login MFA | ✅ Activo | 3 pasos: credenciales → OTP → JWT |
| Cobro Stripe | ✅ Activo | $8,000 MXN licencia + $2,800 MXN/mes |
| Hub operativo (9 áreas) | ✅ Activo | Dashboard central con estados |
| Inocuidad / Termometría | ✅ Activo | Bitácoras congelación, refrigeración, conservación |
| Checklist Abre/Cambio/Cierre | ✅ Activo | 23 puntos de control con toggles |
| Sistema de fotos con sello | ✅ Activo | GPS, timestamp servidor, usuario |
| Voice-to-text | ✅ Activo | Justificaciones y observaciones |
| Audit trail | ✅ Activo | Registro inalterable de cada acción |
| Alertas WhatsApp | ✅ Activo | 8 reglas configuradas |
| Vistas por rol (3) | ✅ Activo | Super Admin, Propietario, Operador |
| Sección web seguridad | ✅ Activo | 4 tarjetas para landing DMZ |
| Cocina / Producción | 🌱 Germinando | Pendiente: formatos operativos |
| Barra / Bebidas | 🌱 Germinando | Pendiente: sliders de líquidos |
| Almacén / Recepción | 🌱 Germinando | Pendiente: cruce a 3 vías |
| Financiero / Costeo | 🌱 Germinando | Pendiente: food cost + Matriz BCG |
| SOPs / Conocimiento | 🌱 Germinando | Pendiente: Manual 5S, higiene |
| RRHH / Turnos | 🌱 Germinando | Pendiente: roles, habilidades |
| Salón / Terrazas | 🌱 Germinando | Pendiente: protocolo servicio |
| Gerencia | 🌱 Germinando | Pendiente: dashboard ejecutivo |

## Paleta de colores (Vitality Kitchen)

| Token | Hex | Uso |
|-------|-----|-----|
| Kale Core | `#146B4F` | Color institucional |
| Green Juice | `#8BB839` | Dinamismo, secundario |
| Cucumber Water | `#DFF6A6` | Respiro visual |
| Lemon Zest | `#E0ED30` | Acento, CTAs |
| Spirulina Shot | `#005056` | Profundidad, contraste |
| Blueberry Yogurt | `#97B9FF` | Estados informativos |
| Coconut Water | `#FEFEFC` | Fondos, aire |

## Seguridad

- **Zero-Trust**: Evidencia fotográfica incorruptible con sello GPS + timestamp servidor
- **Flag_Secure**: Bloqueo de capturas de pantalla a nivel hardware
- **Audit Trail**: Registro inalterable de cada acción (solo lectura)
- **Multi-Tenant**: Aislamiento completo de datos por cliente/sucursal
- **MFA**: Autenticación multifactor obligatoria

## Arquitectura

- **Base de datos**: PostgreSQL con Row-Level Security
- **Cruce a 3 vías**: Purchase Order ↔ Receiving ↔ Invoice
- **Costeo**: Teórico (recetas) vs. Real (inventario contable)
- **Monetización**: Stripe con facturación CFDI

## Versiones

| Versión | Entregable |
|---------|-----------|
| v0.1.0 | Arquitectura relacional (4 capas, 15 entidades) |
| v0.2.0 | Brand guidelines (7 colores, 2 tipografías, 5 isotipos) |
| v0.3.0 | Gatekeeper / Login MFA |
| v0.4.0 | Pantalla de cobro + Hub operativo |
| v0.5.0 | Rebranding a LiTa Support |
| v0.6.0 | Ecosistema 9 áreas + bitácora funcional |
| v0.7.0 | Módulo completo Inocuidad/Termometría |
| v0.8.0 | Ciclo operativo: Apertura + Cambio + Cierre + Alertas WA |
| v0.8.1 | Tres vistas de rol + sistema de fotos |
| v0.9.0 | Sección web seguridad DMZ |
| v1.0.0 | Ecosistema integrado completo |
| v1.0.1 | Export HTML standalone |

---

**Confidencial** · Powered by DMZ · LiTa Support · 2026
