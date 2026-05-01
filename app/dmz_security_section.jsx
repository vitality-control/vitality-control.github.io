import { useState, useEffect } from "react";

const cards = [
  {
    id: "zero-trust",
    number: "01",
    title: "Evidencia incorruptible",
    tag: "ZERO-TRUST PROTOCOL",
    body: "Cada registro operativo se captura exclusivamente desde la aplicaci\u00f3n en tiempo real. El sistema bloquea el acceso a la galer\u00eda del dispositivo, eliminando cualquier posibilidad de manipulaci\u00f3n. Toda evidencia fotogr\u00e1fica se sella autom\u00e1ticamente con coordenadas GPS, marca de tiempo del servidor y credenciales del operador \u2014 generando un certificado de autenticidad irrevocable.",
    icon: "shield",
    accent: "#C9956B",
  },
  {
    id: "flag-secure",
    number: "02",
    title: "Bloqueo de extracci\u00f3n de datos",
    tag: "FLAG_SECURE ACTIVE",
    body: "Las fichas t\u00e9cnicas, manuales de procedimiento, costeo de recetas y propiedad intelectual operativa est\u00e1n blindados a nivel hardware. El sistema impide capturas de pantalla, grabaci\u00f3n de pantalla y cualquier m\u00e9todo de extracci\u00f3n no autorizado. La informaci\u00f3n confidencial de su operaci\u00f3n no sale de la plataforma bajo ninguna circunstancia.",
    icon: "lock",
    accent: "#E24B4A",
  },
  {
    id: "audit-trail",
    number: "03",
    title: "Trazabilidad permanente",
    tag: "AUDIT TRAIL INMUTABLE",
    body: "Cada acci\u00f3n ejecutada en la plataforma genera una huella digital inalterable: qui\u00e9n, qu\u00e9, cu\u00e1ndo y desde d\u00f3nde. Desde el registro de una temperatura hasta la autorizaci\u00f3n de una merma, todo queda documentado en un registro de solo lectura que no puede ser editado, eliminado ni modificado retroactivamente por ning\u00fan nivel de usuario.",
    icon: "eye",
    accent: "#97B9FF",
  },
  {
    id: "multi-tenant",
    number: "04",
    title: "Infraestructura de grado empresarial",
    tag: "POWERED BY DMZ",
    body: "La arquitectura multi-tenant a\u00edsla completamente la informaci\u00f3n de cada cliente y sucursal en entornos particionados. Los datos de un proyecto jam\u00e1s se cruzan con los de otro. Cifrado en tr\u00e1nsito y en reposo, autenticaci\u00f3n multifactor obligatoria y pol\u00edticas de acceso basadas en roles garantizan el est\u00e1ndar m\u00e1ximo de privacidad.",
    icon: "vault",
    accent: "#8BB839",
  },
];

function SecurityIcon({ type, size = 32, color = "#C9956B" }) {
  const props = { width: size, height: size, viewBox: "0 0 32 32", fill: "none" };
  const sw = "1.5";
  
  if (type === "shield") return (
    <svg {...props}>
      <path d="M16 3L27 8v7c0 7.18-4.96 13.9-11 16-6.04-2.1-11-8.82-11-16V8L16 3z" stroke={color} strokeWidth={sw}/>
      <path d="M11 16l3.5 3.5L21 12" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
  if (type === "lock") return (
    <svg {...props}>
      <rect x="7" y="14" width="18" height="13" rx="3" stroke={color} strokeWidth={sw}/>
      <path d="M10 14v-3a6 6 0 1112 0v3" stroke={color} strokeWidth={sw}/>
      <circle cx="16" cy="21" r="2" stroke={color} strokeWidth={sw}/>
      <line x1="16" y1="23" x2="16" y2="25" stroke={color} strokeWidth={sw} strokeLinecap="round"/>
    </svg>
  );
  if (type === "eye") return (
    <svg {...props}>
      <path d="M3 16s5-9 13-9 13 9 13 9-5 9-13 9S3 16 3 16z" stroke={color} strokeWidth={sw}/>
      <circle cx="16" cy="16" r="4" stroke={color} strokeWidth={sw}/>
      <circle cx="16" cy="16" r="1.5" fill={color}/>
    </svg>
  );
  if (type === "vault") return (
    <svg {...props}>
      <rect x="4" y="5" width="24" height="22" rx="3" stroke={color} strokeWidth={sw}/>
      <circle cx="16" cy="16" r="6" stroke={color} strokeWidth={sw}/>
      <circle cx="16" cy="16" r="2" stroke={color} strokeWidth="1.2"/>
      <line x1="16" y1="10" x2="16" y2="7" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="16" x2="25" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="22" x2="16" y2="25" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="10" y1="16" x2="7" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
  return null;
}

function ScanLine() {
  return (
    <div style={{
      position: "absolute", left: 0, right: 0, height: "1px",
      background: "linear-gradient(90deg, transparent, rgba(201,149,107,0.15), transparent)",
      animation: "scanDown 8s linear infinite",
      pointerEvents: "none", zIndex: 1,
    }}/>
  );
}

export default function SecuritySection() {
  const [hovered, setHovered] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      background: "#0a0a0a",
      minHeight: "100vh",
      padding: "48px 24px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "'Montserrat', sans-serif",
    }}>
      <style>{`
        @keyframes scanDown {
          0% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to { width: 40px; }
        }
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <ScanLine />

      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(201,149,107,0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,149,107,0.02) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        pointerEvents: "none",
      }}/>

      <div style={{ position: "relative", zIndex: 2, maxWidth: 800, margin: "0 auto" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          marginBottom: 8,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1)",
        }}>
          <div style={{
            width: 40, height: 1, background: "#C9956B",
            animation: loaded ? "lineGrow 0.6s ease forwards" : "none",
          }}/>
          <span style={{
            fontSize: 11, letterSpacing: 4, color: "#C9956B",
            textTransform: "uppercase", fontWeight: 500,
          }}>
            Arquitectura de seguridad
          </span>
        </div>

        <h2 style={{
          fontSize: 28, fontWeight: 500, color: "#FEFEFC",
          letterSpacing: -0.5, margin: "0 0 6px",
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s",
        }}>
          Sus datos operan en una b&oacute;veda
        </h2>

        <p style={{
          fontSize: 14, color: "rgba(254,254,252,0.35)", margin: "0 0 40px",
          maxWidth: 520, lineHeight: 1.6,
          opacity: loaded ? 1 : 0,
          transform: loaded ? "translateY(0)" : "translateY(20px)",
          transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s",
        }}>
          Cuatro capas de protecci&oacute;n que blindan cada dato,
          receta y movimiento financiero de su operaci&oacute;n.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {cards.map((card, i) => {
            const isHover = hovered === card.id;
            return (
              <div
                key={card.id}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  position: "relative",
                  border: `1px solid ${isHover ? card.accent + "40" : "rgba(254,254,252,0.06)"}`,
                  borderRadius: 14,
                  padding: "24px 24px 24px 24px",
                  background: isHover ? "rgba(254,254,252,0.02)" : "transparent",
                  cursor: "default",
                  transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
                  opacity: loaded ? 1 : 0,
                  transform: loaded ? "translateY(0)" : "translateY(24px)",
                  transitionDelay: `${0.15 + i * 0.1}s`,
                }}
              >
                <div style={{
                  position: "absolute", top: -1, right: 24,
                  padding: "4px 12px",
                  background: "#0a0a0a",
                  border: `1px solid ${card.accent}25`,
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  fontSize: 9, letterSpacing: 3, fontWeight: 500,
                  color: card.accent,
                  fontFamily: "var(--font-mono, 'Courier New', monospace)",
                }}>
                  {card.tag}
                </div>

                <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 12,
                    border: `1px solid ${card.accent}20`,
                    background: `${card.accent}08`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.3s",
                    transform: isHover ? "scale(1.05)" : "scale(1)",
                  }}>
                    <SecurityIcon type={card.icon} size={28} color={card.accent} />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      display: "flex", alignItems: "baseline", gap: 10,
                      marginBottom: 8,
                    }}>
                      <span style={{
                        fontSize: 11, fontWeight: 500, color: card.accent,
                        fontFamily: "var(--font-mono, 'Courier New', monospace)",
                        opacity: 0.5,
                      }}>
                        {card.number}
                      </span>
                      <span style={{
                        fontSize: 17, fontWeight: 500, color: "#FEFEFC",
                        letterSpacing: -0.3,
                      }}>
                        {card.title}
                      </span>
                    </div>

                    <p style={{
                      fontSize: 13, color: "rgba(254,254,252,0.4)",
                      lineHeight: 1.65, margin: 0,
                      transition: "color 0.3s",
                      ...(isHover ? { color: "rgba(254,254,252,0.55)" } : {}),
                    }}>
                      {card.body}
                    </p>
                  </div>
                </div>

                {isHover && (
                  <div style={{
                    position: "absolute", bottom: 0, left: 24, right: 24,
                    height: 1,
                    background: `linear-gradient(90deg, transparent, ${card.accent}30, transparent)`,
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginTop: 32,
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.8s 0.8s",
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: "50%",
            background: "#8BB839",
            animation: "pulseGlow 2s infinite",
          }}/>
          <span style={{
            fontSize: 11, color: "rgba(254,254,252,0.2)",
            letterSpacing: 2, fontWeight: 500,
            fontFamily: "var(--font-mono, 'Courier New', monospace)",
          }}>
            POWERED BY DMZ
          </span>
        </div>
      </div>
    </div>
  );
}
