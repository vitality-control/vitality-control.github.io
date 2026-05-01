import { useState, useEffect } from "react";

const KALE = "#146B4F";
const GREEN_JUICE = "#8BB839";
const CUCUMBER = "#DFF6A6";
const LEMON = "#E0ED30";
const SPIRULINA = "#005056";
const BLUEBERRY = "#97B9FF";
const COCONUT = "#FEFEFC";

const areas = [
  {
    id: "cocina",
    name: "Cocina / Producción",
    icon: "flame",
    status: "germinando",
    desc: "Bitácoras de producción, control de líneas, tablas de gramajes",
    sub: ["Control de líneas", "Producción diaria", "Pre-fermentos", "Gramajes"],
  },
  {
    id: "barra",
    name: "Barra / Bebidas",
    icon: "glass",
    status: "germinando",
    desc: "Recetas de barra, mermas de líquidos, destrucción de envases",
    sub: ["Recetas de barra", "Inventario botellas", "Merma líquidos", "Destrucción envases"],
  },
  {
    id: "almacen",
    name: "Almacén / Recepción",
    icon: "box",
    status: "germinando",
    desc: "Bitácora de recepción, temperaturas, entradas y salidas",
    sub: ["Recepción mercancía", "Temperaturas proveedor", "Min / Máx", "PEPS"],
  },
  {
    id: "inocuidad",
    name: "Inocuidad / Termometría",
    icon: "thermo",
    status: "activo",
    desc: "Registros de temperatura: congelación, refrigeración, conservación",
    sub: ["Bitácora congelación", "Bitácora refrigeración", "Bitácora conservación", "Alertas fuera de rango"],
  },
  {
    id: "financiero",
    name: "Financiero / Costeo",
    icon: "chart",
    status: "germinando",
    desc: "Food cost, costeo de recetas, cruce teórico vs. real, Matriz BCG",
    sub: ["Food cost %", "Costeo recetas", "Cruce 3 vías", "Matriz BCG"],
  },
  {
    id: "sops",
    name: "SOPs / Base de conocimiento",
    icon: "book",
    status: "germinando",
    desc: "Manuales 5S, higiene, glosarios, fichas técnicas integradas",
    sub: ["Manual 5S", "Manual higiene", "Glosario", "Fichas técnicas"],
  },
  {
    id: "rrhh",
    name: "Recursos Humanos / Turnos",
    icon: "people",
    status: "germinando",
    desc: "Asistencia, roles de turno, habilidades, apertura y cierre",
    sub: ["Rol de turnos", "Habilidades", "Apertura / Cierre", "Asistencia"],
  },
  {
    id: "salon",
    name: "Salón / Terrazas / Servicio",
    icon: "sun",
    status: "germinando",
    desc: "Checklists de montaje, protocolo de servicio, bitácora de incidencias",
    sub: ["Terraza 1", "Terraza 2", "Salón principal", "Protocolo servicio"],
  },
  {
    id: "gerencia",
    name: "Gerencia",
    icon: "shield",
    status: "germinando",
    desc: "Dashboard ejecutivo, autorizaciones, mapas de calor, audit trail",
    sub: ["Dashboard ejecutivo", "Autorizaciones PIN", "Mapa de calor", "Audit trail"],
  },
];

function Icon({ type, size = 24, color = KALE }) {
  const s = { width: size, height: size };
  const paths = {
    flame: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M12 18a2 2 0 01-2-2c0-2 2-3 2-5 0 2 2 3 2 5a2 2 0 01-2 2z" fill={color} opacity="0.3"/></svg>,
    glass: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M6 3h12l-2 13a2 2 0 01-2 2h-4a2 2 0 01-2-2L6 3z" stroke={color} strokeWidth="1.5"/><line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth="1.5"/><line x1="8" y1="22" x2="16" y2="22" stroke={color} strokeWidth="1.5" strokeLinecap="round"/></svg>,
    box: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M3 8l9-5 9 5v8l-9 5-9-5V8z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M3 8l9 5 9-5M12 13v9" stroke={color} strokeWidth="1.5"/></svg>,
    thermo: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M14 14.76V3a2 2 0 10-4 0v11.76a4 4 0 104 0z" stroke={color} strokeWidth="1.5"/><circle cx="12" cy="18" r="1.5" fill={color}/></svg>,
    chart: <svg {...s} viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke={color} strokeWidth="1.5"/><rect x="10" y="7" width="4" height="14" rx="1" stroke={color} strokeWidth="1.5"/><rect x="17" y="3" width="4" height="18" rx="1" stroke={color} strokeWidth="1.5"/></svg>,
    book: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M4 4h6a2 2 0 012 2v14a1 1 0 00-1-1H4V4z" stroke={color} strokeWidth="1.5"/><path d="M20 4h-6a2 2 0 00-2 2v14a1 1 0 011-1h7V4z" stroke={color} strokeWidth="1.5"/></svg>,
    people: <svg {...s} viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="3" stroke={color} strokeWidth="1.5"/><circle cx="17" cy="7" r="2.5" stroke={color} strokeWidth="1.2"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke={color} strokeWidth="1.5"/><path d="M17 15a3 3 0 013 3v3" stroke={color} strokeWidth="1.2"/></svg>,
    sun: <svg {...s} viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5"/>{[0,45,90,135,180,225,270,315].map(a=><line key={a} x1="12" y1="2" x2="12" y2="5" stroke={color} strokeWidth="1.5" strokeLinecap="round" transform={`rotate(${a} 12 12)`}/>)}</svg>,
    shield: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    check: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    leaf: <svg {...s} viewBox="0 0 24 24" fill="none"><path d="M6 21c4-4 6-8 6-14 0 6 2 10 6 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 7c-3 3-5 7-5.5 11" stroke={color} strokeWidth="1.2" opacity="0.5"/></svg>,
  };
  return paths[type] || null;
}

function Logomark({ size = 40 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48">
      <g transform="translate(24,24)">
        {Array.from({ length: 12 }).map((_, i) => (
          <line key={i} x1="0" y1="-16" x2="0" y2="-8" stroke={LEMON} strokeWidth="3" strokeLinecap="round" transform={`rotate(${i * 30})`} />
        ))}
        <circle cx="0" cy="0" r="3.5" fill="none" stroke={LEMON} strokeWidth="1.8" />
      </g>
    </svg>
  );
}

function PaymentScreen({ onComplete }) {
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [plan, setPlan] = useState("both");

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
      setTimeout(() => onComplete(), 1800);
    }, 2200);
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: SPIRULINA, fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ textAlign: "center", animation: "fadeUp 0.6s ease" }}>
          <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(139,184,57,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Icon type="check" size={36} color={GREEN_JUICE} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 500, color: COCONUT, marginBottom: 6 }}>Licencia activada</div>
          <div style={{ fontSize: 14, color: GREEN_JUICE, opacity: 0.8 }}>Tu ecosistema Vitality Kitchen está listo para nutrir</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: `linear-gradient(160deg, ${SPIRULINA} 0%, ${KALE} 100%)`, fontFamily: "'Montserrat', sans-serif", padding: "2rem 1rem" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logomark size={44} />
          <div style={{ fontSize: 24, fontWeight: 500, color: COCONUT, marginTop: 8, letterSpacing: -0.5 }}>vitality kitchen</div>
          <div style={{ fontSize: 12, color: GREEN_JUICE, letterSpacing: 2, marginTop: 2 }}>activa tu ecosistema</div>
        </div>

        <div style={{ background: "rgba(254,254,252,0.97)", borderRadius: 16, padding: "28px 24px", backdropFilter: "blur(12px)" }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: SPIRULINA, marginBottom: 4 }}>Plan de inversión</div>
          <div style={{ fontSize: 12, color: KALE, opacity: 0.6, marginBottom: 20 }}>Powered by DMZA · Pago seguro vía Stripe</div>

          {/* License card */}
          <div style={{ border: `1.5px solid ${plan === "both" || plan === "license" ? GREEN_JUICE : CUCUMBER}`, borderRadius: 12, padding: "16px 18px", marginBottom: 12, cursor: "pointer", transition: "all 0.2s", background: plan === "both" || plan === "license" ? "rgba(139,184,57,0.04)" : "transparent" }} onClick={() => setPlan("both")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: SPIRULINA }}>Licencia de activación</div>
                <div style={{ fontSize: 11, color: KALE, opacity: 0.6, marginTop: 2 }}>Pago único · Renovación anual</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: KALE }}>$8,000</div>
                <div style={{ fontSize: 11, color: KALE, opacity: 0.5 }}>MXN</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
              {["Acceso completo", "Soporte DMZA", "Audit trail", "Multi-sucursal"].map(t => (
                <span key={t} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 20, background: "rgba(139,184,57,0.1)", color: KALE, fontWeight: 500 }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Monthly card */}
          <div style={{ border: `1.5px solid ${CUCUMBER}`, borderRadius: 12, padding: "16px 18px", marginBottom: 20, background: "rgba(223,246,166,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, color: SPIRULINA }}>Suscripción por sucursal</div>
                <div style={{ fontSize: 11, color: KALE, opacity: 0.6, marginTop: 2 }}>Cargo mensual recurrente</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 22, fontWeight: 600, color: KALE }}>$2,800</div>
                <div style={{ fontSize: 11, color: KALE, opacity: 0.5 }}>MXN / mes</div>
              </div>
            </div>
          </div>

          {/* Total */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "14px 0", borderTop: `1px solid ${CUCUMBER}`, marginBottom: 20 }}>
            <span style={{ fontSize: 13, color: KALE, opacity: 0.7 }}>Total primer cobro</span>
            <div>
              <span style={{ fontSize: 26, fontWeight: 600, color: SPIRULINA }}>$10,800</span>
              <span style={{ fontSize: 12, color: KALE, opacity: 0.5, marginLeft: 4 }}>MXN</span>
            </div>
          </div>

          {/* Stripe CTA */}
          <button
            onClick={handlePay}
            disabled={processing}
            style={{
              width: "100%", height: 48, border: "none", borderRadius: 10,
              background: processing ? KALE : SPIRULINA, color: COCONUT,
              fontSize: 14, fontWeight: 500, cursor: processing ? "wait" : "pointer",
              fontFamily: "inherit", letterSpacing: 0.3,
              transition: "all 0.3s", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {processing ? (
              <>
                <div style={{ width: 18, height: 18, border: `2px solid ${CUCUMBER}`, borderTopColor: "transparent", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Procesando pago...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke={COCONUT} strokeWidth="1.5"/><line x1="2" y1="10" x2="22" y2="10" stroke={COCONUT} strokeWidth="1.5"/></svg>
                Pagar con Stripe
              </>
            )}
          </button>

          <div style={{ textAlign: "center", marginTop: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><rect x="1" y="4" width="10" height="7" rx="2" stroke={KALE} strokeWidth="1" opacity="0.4"/><path d="M3 4V3a3 3 0 016 0v1" stroke={KALE} strokeWidth="1" opacity="0.4"/></svg>
            <span style={{ fontSize: 11, color: KALE, opacity: 0.4 }}>Cifrado SSL · Facturación automática CFDI</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11, color: "rgba(254,254,252,0.3)", lineHeight: 1.6 }}>
          Al realizar el pago aceptas los términos de servicio DMZA.<br />
          La suscripción mensual se cobra el día 1 de cada mes.
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function HubScreen() {
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: COCONUT, fontFamily: "'Montserrat', sans-serif" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${SPIRULINA}, ${KALE})`, padding: "20px 24px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Logomark size={32} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: COCONUT, letterSpacing: -0.3 }}>vitality kitchen</div>
              <div style={{ fontSize: 10, color: GREEN_JUICE, letterSpacing: 1.5 }}>ecosistema operativo</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: GREEN_JUICE }} />
            <span style={{ fontSize: 11, color: COCONUT, opacity: 0.7 }}>Licencia activa</span>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
          <div style={{ background: "rgba(254,254,252,0.08)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: CUCUMBER, opacity: 0.7, marginBottom: 4 }}>Áreas activas</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: LEMON }}>1<span style={{ fontSize: 12, fontWeight: 400, color: CUCUMBER, opacity: 0.5 }}> / 9</span></div>
          </div>
          <div style={{ background: "rgba(254,254,252,0.08)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: CUCUMBER, opacity: 0.7, marginBottom: 4 }}>Germinando</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: CUCUMBER }}>8</div>
          </div>
          <div style={{ background: "rgba(254,254,252,0.08)", borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: CUCUMBER, opacity: 0.7, marginBottom: 4 }}>Sucursal</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: COCONUT }}>Puebla</div>
          </div>
        </div>
      </div>

      {/* Areas grid */}
      <div style={{ padding: "20px 16px" }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: SPIRULINA, marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon type="leaf" size={16} color={GREEN_JUICE} />
          Áreas operativas
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {areas.map((area) => {
            const isActive = area.status === "activo";
            const isSelected = selected === area.id;
            const isHover = hovered === area.id;

            return (
              <div
                key={area.id}
                onClick={() => setSelected(isSelected ? null : area.id)}
                onMouseEnter={() => setHovered(area.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  border: `1px solid ${isActive ? GREEN_JUICE : isHover ? CUCUMBER : "rgba(0,80,86,0.08)"}`,
                  borderRadius: 14,
                  padding: "16px 14px",
                  cursor: "pointer",
                  transition: "all 0.25s ease",
                  background: isActive ? "rgba(139,184,57,0.04)" : isSelected ? "rgba(0,80,86,0.02)" : "white",
                  position: "relative",
                  overflow: "hidden",
                  gridColumn: area.id === "gerencia" ? "1 / -1" : undefined,
                }}
              >
                {/* Status badge */}
                <div style={{
                  position: "absolute", top: 10, right: 10,
                  fontSize: 9, fontWeight: 500, letterSpacing: 0.5,
                  padding: "2px 8px", borderRadius: 20,
                  background: isActive ? "rgba(139,184,57,0.12)" : "rgba(223,246,166,0.3)",
                  color: isActive ? KALE : "rgba(0,80,86,0.4)",
                }}>
                  {isActive ? "activo" : "germinando"}
                </div>

                <div style={{ marginBottom: 8, opacity: isActive ? 1 : 0.4 }}>
                  <Icon type={area.icon} size={28} color={isActive ? KALE : SPIRULINA} />
                </div>

                <div style={{ fontSize: 13, fontWeight: 500, color: SPIRULINA, marginBottom: 3, paddingRight: 60 }}>
                  {area.name}
                </div>

                {!isActive && (
                  <div style={{ fontSize: 11, color: KALE, opacity: 0.35, lineHeight: 1.4, marginBottom: isSelected ? 12 : 0 }}>
                    {area.desc}
                  </div>
                )}

                {isActive && (
                  <div style={{ fontSize: 11, color: KALE, opacity: 0.6, lineHeight: 1.4, marginBottom: isSelected ? 12 : 0 }}>
                    {area.desc}
                  </div>
                )}

                {/* Expanded sub-areas */}
                {isSelected && (
                  <div style={{ animation: "fadeUp 0.3s ease" }}>
                    <div style={{ borderTop: `1px solid ${isActive ? "rgba(139,184,57,0.2)" : "rgba(0,80,86,0.06)"}`, paddingTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
                      {area.sub.map((s, i) => (
                        <div key={i} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          fontSize: 12, color: isActive ? KALE : "rgba(0,80,86,0.35)",
                          padding: "6px 10px", borderRadius: 8,
                          background: isActive ? "rgba(139,184,57,0.06)" : "rgba(0,80,86,0.02)",
                        }}>
                          <div style={{
                            width: 6, height: 6, borderRadius: "50%",
                            background: isActive ? GREEN_JUICE : "rgba(0,80,86,0.15)",
                          }} />
                          {s}
                          {!isActive && (
                            <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(0,80,86,0.25)" }}>
                              pronto
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {!isActive && (
                      <div style={{
                        marginTop: 10, padding: "10px 12px", borderRadius: 10,
                        background: "rgba(223,246,166,0.15)",
                        border: "1px dashed rgba(139,184,57,0.2)",
                        textAlign: "center",
                      }}>
                        <Icon type="leaf" size={16} color={GREEN_JUICE} />
                        <div style={{ fontSize: 11, color: KALE, opacity: 0.5, marginTop: 4, lineHeight: 1.4 }}>
                          Esta área está germinando — nutriéndose con tus formatos para florecer pronto
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "12px 16px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: "rgba(0,80,86,0.25)", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><rect x="1" y="4" width="10" height="7" rx="2" stroke="rgba(0,80,86,0.25)" strokeWidth="1"/><path d="M3 4V3a3 3 0 016 0v1" stroke="rgba(0,80,86,0.25)" strokeWidth="1"/></svg>
          Protegido por DMZA · Audit trail activo · v0.4.0
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default function App() {
  const [paid, setPaid] = useState(false);

  return paid ? <HubScreen /> : <PaymentScreen onComplete={() => setPaid(true)} />;
}
