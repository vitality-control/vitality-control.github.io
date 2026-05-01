import { useState, useEffect, useRef } from "react";

const K="#146B4F",GJ="#8BB839",CW="#DFF6A6",LZ="#E0ED30",SP="#005056",BB="#97B9FF",CO="#FEFEFC",CU="#C9956B";

function Logomark({size=32}){
  return <svg width={size} height={size} viewBox="0 0 48 48"><g transform="translate(24,24)">{Array.from({length:12}).map((_,i)=><line key={i} x1="0" y1={-size*.33} x2="0" y2={-size*.17} stroke={LZ} strokeWidth={size*.06} strokeLinecap="round" transform={`rotate(${i*30})`}/>)}<circle cx="0" cy="0" r={size*.07} fill="none" stroke={LZ} strokeWidth={size*.04}/></g></svg>;
}

function Ic({d,color=K,size=20}){return <svg width={size} height={size} viewBox="0 0 24 24" fill="none"><path d={d} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;}

function Toggle({on,onToggle,disabled}){
  return <div onClick={disabled?undefined:onToggle} style={{width:48,height:26,borderRadius:13,background:on?GJ:"rgba(0,80,86,.12)",cursor:disabled?"default":"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
    <div style={{width:20,height:20,borderRadius:10,background:"#FFF",position:"absolute",top:3,left:on?25:3,transition:"left .2s"}}/>
  </div>;
}

function Badge({text,color=K,bg="rgba(139,184,57,.1)"}){
  return <span style={{fontSize:9,padding:"2px 7px",borderRadius:12,background:bg,color,fontWeight:500}}>{text}</span>;
}

const AREAS=[
  {id:"cocina",n:"Cocina / Producción",st:"germinando",ic:"M12 2c0 4-4 6-4 10a4 4 0 108 0c0-4-4-6-4-10z"},
  {id:"barra",n:"Barra / Bebidas",st:"germinando",ic:"M6 3h12l-2 13a2 2 0 01-2 2h-4a2 2 0 01-2-2L6 3z"},
  {id:"almacen",n:"Almacén / Recepción",st:"germinando",ic:"M3 8l9-5 9 5v8l-9 5-9-5V8z"},
  {id:"inocuidad",n:"Inocuidad / Termometría",st:"activo",ic:"M14 14.76V3a2 2 0 10-4 0v11.76a4 4 0 104 0z"},
  {id:"financiero",n:"Financiero / Costeo",st:"germinando",ic:"M3 12h4v9H3zM10 7h4v14h-4zM17 3h4v18h-4z"},
  {id:"sops",n:"SOPs / Conocimiento",st:"germinando",ic:"M4 4h6a2 2 0 012 2v14a1 1 0 00-1-1H4V4z"},
  {id:"rrhh",n:"Recursos Humanos",st:"germinando",ic:"M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"},
  {id:"salon",n:"Salón / Terrazas / Servicio",st:"germinando",ic:"M12 3v1m0 16v1m9-9h-1M4 12H3m15.36 6.36l-.7-.7M6.34 6.34l-.7-.7m12.72 0l-.7.7M6.34 17.66l-.7.7M16 12a4 4 0 11-8 0 4 4 0 018 0z"},
  {id:"gerencia",n:"Gerencia",st:"germinando",ic:"M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4z",full:true},
];

const CHECKS_APERTURA=[
  {id:"a1",t:"Verificar temperaturas refrigeración (4°C)",cat:"inocuidad",critical:true},
  {id:"a2",t:"Verificar temperaturas congelación (-18°C)",cat:"inocuidad",critical:true},
  {id:"a3",t:"Revisar caducidades y PEPS",cat:"inocuidad",critical:true},
  {id:"a4",t:"Sanitizar superficies de trabajo",cat:"limpieza",photo:true},
  {id:"a5",t:"Verificar stock mínimo líneas de producción",cat:"almacen",critical:true},
  {id:"a6",t:"Encender y calibrar hornos, planchas",cat:"equipo"},
  {id:"a7",t:"Confirmar personal vs. rol de turno",cat:"rrhh"},
  {id:"a8",t:"Foto general cocina al abrir",cat:"evidencia",photo:true,critical:true},
];

const MOCK_WA=[
  {time:"06:05",msg:"Apertura iniciada por Chef Marco",level:"info"},
  {time:"06:18",msg:"ALERTA: Congelador 2 a -12°C (límite -18°C)",level:"danger"},
  {time:"06:45",msg:"Apertura completada — 12/12 puntos",level:"info"},
  {time:"15:05",msg:"ALERTA: Refri postres a 6°C (límite 4°C)",level:"danger"},
  {time:"15:20",msg:"Cambio turno firmado Marco → Luis",level:"info"},
  {time:"23:10",msg:"CIERRE: Cumplimiento 94% · 3/3 fases · 2 alertas",level:"info"},
];

function now(){return new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"});}
function today(){return new Date().toLocaleDateString("es-MX",{weekday:"long",day:"numeric",month:"long"});}

export default function App(){
  const [screen,setScreen]=useState("login");
  const [loginStep,setLoginStep]=useState(1);
  const [payProcessing,setPayProcessing]=useState(false);
  const [role,setRole]=useState("oper");
  const [hubArea,setHubArea]=useState(null);
  const [checks,setChecks]=useState({});
  const [photos,setPhotos]=useState({});
  const [tempStr,setTempStr]=useState("");
  const [tempEntries,setTempEntries]=useState([]);
  const [bitacora,setBitacora]=useState(null);
  const [photoCapture,setPhotoCapture]=useState(null);
  const [voiceState,setVoiceState]=useState("idle");
  const [voiceText,setVoiceText]=useState("");
  const [auditLog,setAuditLog]=useState([]);
  const [waAlerts]=useState(MOCK_WA);

  function addAudit(action,detail){
    setAuditLog(prev=>[{time:now(),action,detail,user:role==="admin"?"LiTa Admin":role==="client"?"Propietario":"Chef Marco"},...prev]);
  }

  function handleLogin(){
    if(loginStep===1){setLoginStep(2);addAudit("Login","Credenciales verificadas");}
    else if(loginStep===2){setLoginStep(3);addAudit("MFA","Código OTP validado");}
    else{setScreen("payment");addAudit("Sesión","JWT token activo");}
  }

  function handlePay(){
    setPayProcessing(true);
    addAudit("Pago","Procesando $10,800 MXN vía Stripe");
    setTimeout(()=>{setPayProcessing(false);setScreen("hub");addAudit("Licencia","Activada — Vitality Kitchen Puebla");},2000);
  }

  function toggleCheck(id){
    setChecks(prev=>({...prev,[id]:!prev[id]}));
    addAudit("Check",`${prev=>prev[id]?"OFF":"ON"} — ${id}`);
  }

  function handleNumKey(k){
    if(k==="del") setTempStr(prev=>prev.slice(0,-1));
    else if(k==="-") setTempStr(prev=>prev[0]==="-"?prev.slice(1):"-"+prev);
    else if(k===".") setTempStr(prev=>prev.includes(".")?prev:prev+".");
    else setTempStr(prev=>prev.length<5?prev+k:prev);
  }

  function saveTempEntry(){
    if(!tempStr) return;
    const v=parseFloat(tempStr);
    const limit=bitacora==="cong"?-18:4;
    const oor=bitacora==="cong"?v>limit:v>limit;
    if(oor&&!photoCapture) return;
    if(oor&&voiceState!=="done") return;
    setTempEntries(prev=>[{temp:tempStr,time:now(),oor,photo:!!photoCapture,voice:voiceText},...prev]);
    addAudit("Temp registrada",`${tempStr}°C ${oor?"FUERA DE RANGO":"OK"}`);
    setTempStr("");setPhotoCapture(null);setVoiceState("idle");setVoiceText("");
  }

  const tempVal=parseFloat(tempStr);
  const isOOR=bitacora&&!isNaN(tempVal)&&(bitacora==="cong"?tempVal>-18:tempVal>4);

  // ==================== RENDER ====================

  // --- LOGIN ---
  if(screen==="login"){
    return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:SP,padding:"2rem 1rem"}}>
      <div style={{width:"100%",maxWidth:400,animation:"fadeUp .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <Logomark size={40}/>
          <div style={{fontSize:24,fontWeight:500,color:CO,marginTop:6}}>vitality kitchen</div>
          <div style={{fontSize:11,color:GJ,letterSpacing:2,marginTop:2}}>cocina consciente</div>
        </div>
        <div style={{background:"rgba(254,254,252,.97)",borderRadius:16,padding:"28px 24px"}}>
          {loginStep===1&&<>
            <div style={{fontSize:15,fontWeight:500,color:SP,marginBottom:2}}>Acceso al proyecto</div>
            <div style={{fontSize:11,color:K,opacity:.6,marginBottom:20}}>Ingresa tus credenciales autorizadas</div>
            <label style={{fontSize:11,color:SP,fontWeight:500,display:"block",marginBottom:4}}>Correo electrónico</label>
            <input type="email" placeholder="tu@correo.com" style={{width:"100%",boxSizing:"border-box",height:40,border:`1px solid ${CW}`,borderRadius:8,padding:"0 12px",fontSize:13,color:SP,outline:"none",marginBottom:12}}/>
            <label style={{fontSize:11,color:SP,fontWeight:500,display:"block",marginBottom:4}}>Contraseña</label>
            <input type="password" placeholder="••••••••" style={{width:"100%",boxSizing:"border-box",height:40,border:`1px solid ${CW}`,borderRadius:8,padding:"0 12px",fontSize:13,color:SP,outline:"none",marginBottom:16}}/>
          </>}
          {loginStep===2&&<div style={{textAlign:"center"}}>
            <div style={{fontSize:15,fontWeight:500,color:SP,marginBottom:2}}>Verificación en dos pasos</div>
            <div style={{fontSize:11,color:K,opacity:.6,marginBottom:20}}>Código de 6 dígitos de tu app autenticadora</div>
            <div style={{display:"flex",gap:6,justifyContent:"center",marginBottom:16}}>
              {[1,2,3,4,5,6].map(i=><input key={i} type="text" maxLength="1" style={{width:40,height:48,textAlign:"center",border:`1.5px solid ${CW}`,borderRadius:8,fontSize:20,fontWeight:500,color:SP,outline:"none",fontFamily:"var(--font-mono)"}}/>)}
            </div>
          </div>}
          {loginStep===3&&<div style={{textAlign:"center",padding:"12px 0"}}>
            <div style={{width:56,height:56,borderRadius:"50%",background:"rgba(139,184,57,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 12px"}}>
              <Ic d="M5 12l5 5L20 7" color={GJ} size={28}/>
            </div>
            <div style={{fontSize:16,fontWeight:500,color:SP}}>Identidad verificada</div>
            <div style={{fontSize:12,color:K,opacity:.6,marginTop:4}}>Bienvenido al ecosistema</div>
          </div>}
          <button onClick={handleLogin} style={{width:"100%",height:44,border:"none",borderRadius:10,background:K,color:CO,fontSize:14,fontWeight:500,cursor:"pointer",marginTop:loginStep===3?12:0}}>
            {loginStep===1?"Verificar identidad":loginStep===2?"Validar código":"Continuar"}
          </button>
          {loginStep===1&&<div style={{textAlign:"center",marginTop:12}}>
            <span style={{fontSize:11,color:K,opacity:.4,borderBottom:"1px dashed rgba(20,107,79,.25)",cursor:"pointer"}}>Solicitar acceso al proyecto</span>
          </div>}
        </div>
        <div style={{display:"flex",gap:4,justifyContent:"center",marginTop:16}}>
          {[1,2,3].map(i=><div key={i} style={{width:8,height:8,borderRadius:4,background:loginStep>=i?LZ:"rgba(224,237,48,.2)",transition:"all .3s"}}/>)}
        </div>
        <div style={{textAlign:"center",marginTop:12,fontSize:10,color:"rgba(254,254,252,.2)"}}>Protegido por LiTa support · Audit trail activo</div>
      </div>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>;
  }

  // --- PAYMENT ---
  if(screen==="payment"){
    return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:SP,padding:"2rem 1rem"}}>
      <div style={{width:"100%",maxWidth:420,animation:"fadeUp .5s ease"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <Logomark size={36}/>
          <div style={{fontSize:20,fontWeight:500,color:CO,marginTop:4}}>vitality kitchen</div>
          <div style={{fontSize:11,color:GJ,letterSpacing:2}}>activa tu ecosistema</div>
        </div>
        <div style={{background:"rgba(254,254,252,.97)",borderRadius:16,padding:"24px 22px"}}>
          <div style={{fontSize:14,fontWeight:500,color:SP,marginBottom:2}}>Plan de inversión</div>
          <div style={{fontSize:11,color:K,opacity:.5,marginBottom:16}}>Powered by LiTa support · Pago seguro vía Stripe</div>
          <div style={{border:`1.5px solid ${GJ}`,borderRadius:12,padding:"12px 14px",marginBottom:8,background:"rgba(139,184,57,.03)"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontSize:13,fontWeight:500,color:SP}}>Licencia de activación</div><div style={{fontSize:10,color:K,opacity:.5}}>Pago único · Renovación anual</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500,color:K}}>$8,000</div><div style={{fontSize:10,color:K,opacity:.4}}>MXN</div></div>
            </div>
          </div>
          <div style={{border:`1.5px solid ${CW}`,borderRadius:12,padding:"12px 14px",marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><div style={{fontSize:13,fontWeight:500,color:SP}}>Suscripción por sucursal</div><div style={{fontSize:10,color:K,opacity:.5}}>Cargo mensual recurrente</div></div>
              <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:500,color:K}}>$2,800</div><div style={{fontSize:10,color:K,opacity:.4}}>MXN / mes</div></div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",padding:"12px 0",borderTop:`1px solid ${CW}`,marginBottom:14}}>
            <span style={{fontSize:12,color:K,opacity:.5}}>Total primer cobro</span>
            <div><span style={{fontSize:24,fontWeight:500,color:SP}}>$10,800</span><span style={{fontSize:11,color:K,opacity:.4,marginLeft:4}}>MXN</span></div>
          </div>
          <button onClick={handlePay} disabled={payProcessing} style={{width:"100%",height:44,border:"none",borderRadius:10,background:payProcessing?SP:K,color:CO,fontSize:14,fontWeight:500,cursor:payProcessing?"wait":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            {payProcessing?<><div style={{width:16,height:16,border:`2px solid ${CW}`,borderTopColor:"transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/> Procesando...</>:"Pagar con Stripe"}
          </button>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>;
  }

  // --- MAIN APP (HUB + MODULES) ---
  const headerBg=role==="admin"?"#1a1a1a":role==="client"?K:SP;
  const headerAccent=role==="admin"?CU:role==="client"?CO:LZ;

  return <div style={{minHeight:"100vh",background:"var(--color-background-primary)",animation:"fadeUp .4s ease"}}>
    <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes blink{0%,100%{opacity:1}50%{opacity:.4}}`}</style>

    {/* ROLE SWITCHER */}
    <div style={{display:"flex",borderBottom:"1px solid rgba(0,80,86,.06)"}}>
      {[["admin","Super Admin","LiTa"],["client","Propietario","Vitality"],["oper","Operador","Turno"]].map(([r,label,sub])=>(
        <div key={r} onClick={()=>{setRole(r);setHubArea(null);setBitacora(null);}} style={{flex:1,padding:"10px 4px",textAlign:"center",fontSize:11,fontWeight:500,cursor:"pointer",transition:"all .2s",
          background:role===r?(r==="admin"?"#1a1a1a":r==="client"?K:SP):"transparent",
          color:role===r?(r==="admin"?CU:CO):"rgba(0,80,86,.35)"}}>
          {label}<br/><span style={{fontSize:9,opacity:.6}}>{sub}</span>
        </div>
      ))}
    </div>

    {/* HEADER */}
    <div style={{background:headerBg,padding:"14px 16px 16px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <Logomark size={24}/>
          <div>
            <div style={{fontSize:13,fontWeight:500,color:headerAccent}}>vitality kitchen</div>
            <div style={{fontSize:9,color:role==="admin"?CU:GJ,letterSpacing:1,opacity:.7}}>
              {role==="admin"?"ojo de dios · lita":role==="client"?"panel propietario":"cocina · turno vespertino"}
            </div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:6,height:6,borderRadius:3,background:GJ}}/>
          <span style={{fontSize:10,color:headerAccent,opacity:.4}}>Activa</span>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6}}>
        {role==="admin"?<>
          <div style={{background:"rgba(201,149,107,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:CU,opacity:.5}}>Clientes</div><div style={{fontSize:16,fontWeight:500,color:CU}}>1</div></div>
          <div style={{background:"rgba(201,149,107,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:CU,opacity:.5}}>Sucursales</div><div style={{fontSize:16,fontWeight:500,color:CU}}>1</div></div>
          <div style={{background:"rgba(226,75,74,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:CU,opacity:.5}}>Alertas hoy</div><div style={{fontSize:16,fontWeight:500,color:"#E24B4A"}}>2</div></div>
        </>:role==="client"?<>
          <div style={{background:"rgba(254,254,252,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:CW,opacity:.5}}>Cumplimiento</div><div style={{fontSize:16,fontWeight:500,color:LZ}}>87%</div></div>
          <div style={{background:"rgba(254,254,252,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:CW,opacity:.5}}>Alertas WA</div><div style={{fontSize:16,fontWeight:500,color:"#F09595"}}>2</div></div>
          <div style={{background:"rgba(254,254,252,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:CW,opacity:.5}}>FC%</div><div style={{fontSize:16,fontWeight:500,color:GJ}}>28%</div></div>
        </>:<>
          <div style={{background:"rgba(254,254,252,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:LZ,opacity:.5}}>Mi turno</div><div style={{fontSize:14,fontWeight:500,color:CO}}>Vespert.</div></div>
          <div style={{background:"rgba(254,254,252,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:LZ,opacity:.5}}>Registros</div><div style={{fontSize:16,fontWeight:500,color:LZ}}>{tempEntries.length}</div></div>
          <div style={{background:"rgba(254,254,252,.06)",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:9,color:LZ,opacity:.5}}>Checks</div><div style={{fontSize:16,fontWeight:500,color:CO}}>{Object.values(checks).filter(Boolean).length}</div></div>
        </>}
      </div>
    </div>

    {/* CONTENT */}
    <div style={{padding:"12px 14px 20px"}}>

      {/* === HUB VIEW === */}
      {!hubArea&&!bitacora&&<div style={{animation:"fadeUp .3s ease"}}>
        <div style={{fontSize:12,fontWeight:500,color:SP,marginBottom:10,display:"flex",alignItems:"center",gap:5}}>
          <Ic d="M6 21c4-4 6-8 6-14 0 6 2 10 6 14" color={GJ} size={14}/>
          Áreas operativas
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
          {AREAS.map(a=>{
            const act=a.st==="activo";
            return <div key={a.id} onClick={()=>setHubArea(a.id)} style={{border:`1px solid ${act?"rgba(139,184,57,.15)":"rgba(0,80,86,.06)"}`,borderRadius:11,padding:"11px 10px",cursor:"pointer",transition:"all .2s",background:act?"rgba(139,184,57,.02)":"var(--color-background-primary)",gridColumn:a.full?"1/-1":undefined}}>
              <div style={{position:"relative"}}>
                <div style={{position:"absolute",top:0,right:0}}><Badge text={act?"activo":"germinando"} color={act?K:"rgba(0,80,86,.3)"} bg={act?"rgba(139,184,57,.1)":"rgba(223,246,166,.18)"}/></div>
                <div style={{opacity:act?1:.3,marginBottom:4}}><Ic d={a.ic} color={act?K:SP}/></div>
                <div style={{fontSize:11,fontWeight:500,color:SP,paddingRight:50}}>{a.n}</div>
              </div>
            </div>;
          })}
        </div>

        {/* WA ALERTS FOR CLIENT */}
        {role==="client"&&<div style={{marginTop:14}}>
          <div style={{fontSize:12,fontWeight:500,color:SP,marginBottom:8}}>Alertas WhatsApp de hoy</div>
          {waAlerts.map((w,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:"1px solid rgba(139,184,57,.08)",marginBottom:4,background:"rgba(139,184,57,.01)"}}>
            <div style={{width:7,height:7,borderRadius:4,background:w.level==="danger"?"#E24B4A":w.level==="warning"?"#EF9F27":GJ,flexShrink:0}}/>
            <div style={{flex:1,fontSize:11,color:SP}}>{w.msg}</div>
            <span style={{fontSize:9,color:K,opacity:.3,fontFamily:"var(--font-mono)"}}>{w.time}</span>
          </div>)}
        </div>}

        {/* AUDIT FOR ADMIN */}
        {role==="admin"&&auditLog.length>0&&<div style={{marginTop:14}}>
          <div style={{fontSize:12,fontWeight:500,color:SP,marginBottom:8}}>Audit trail de la sesión</div>
          {auditLog.slice(0,10).map((a,i)=><div key={i} style={{display:"flex",gap:6,padding:"5px 0",borderBottom:"1px solid rgba(0,80,86,.04)",fontSize:10}}>
            <span style={{color:"var(--color-text-secondary)",minWidth:50,fontFamily:"var(--font-mono)"}}>{a.time}</span>
            <span style={{fontWeight:500,color:a.action.includes("ALERTA")?"#A32D2D":"var(--color-text-primary)",minWidth:80}}>{a.action}</span>
            <span style={{color:"var(--color-text-secondary)",flex:1}}>{a.detail}</span>
          </div>)}
        </div>}
      </div>}

      {/* === AREA DETAIL === */}
      {hubArea&&!bitacora&&<div style={{animation:"fadeUp .3s ease"}}>
        <div onClick={()=>setHubArea(null)} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:K,opacity:.5,cursor:"pointer",marginBottom:10}}>
          <Ic d="M15 18l-6-6 6-6" color={K} size={14}/> Ecosistema
        </div>
        {(()=>{
          const a=AREAS.find(x=>x.id===hubArea);
          const act=a.st==="activo";
          return <>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{width:40,height:40,borderRadius:10,background:act?"rgba(139,184,57,.06)":"rgba(0,80,86,.03)",display:"flex",alignItems:"center",justifyContent:"center"}}><Ic d={a.ic} color={act?K:SP} size={22}/></div>
              <div><div style={{fontSize:15,fontWeight:500,color:SP}}>{a.n}</div><Badge text={act?"activo":"germinando"} color={act?K:"rgba(0,80,86,.3)"} bg={act?"rgba(139,184,57,.1)":"rgba(223,246,166,.18)"}/></div>
            </div>

            {act&&hubArea==="inocuidad"&&<>
              {/* CHECKLIST APERTURA */}
              <div style={{fontSize:12,fontWeight:500,color:SP,marginBottom:8}}>Checklist de apertura</div>
              {CHECKS_APERTURA.map(c=>{
                const on=checks[c.id];
                return <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 10px",borderRadius:8,border:`1px solid ${on?"rgba(139,184,57,.12)":"rgba(0,80,86,.04)"}`,marginBottom:4,background:on?"rgba(139,184,57,.02)":"transparent",transition:"all .2s"}}>
                  <Toggle on={on} onToggle={()=>setChecks(prev=>({...prev,[c.id]:!prev[c.id]}))}/>
                  <div style={{flex:1,fontSize:12,color:on?K:SP}}>{c.t}</div>
                  {c.critical&&<Badge text="crítico" color="#A32D2D" bg="rgba(226,75,74,.06)"/>}
                </div>;
              })}

              <div style={{fontSize:12,fontWeight:500,color:SP,marginTop:14,marginBottom:8}}>Bitácoras de temperatura</div>
              {[["cong","Congelación","Límite: -18°C"],["refri","Refrigeración","Límite: 4°C"],["cons","Conservación","Límite: 4°C / -18°C"]].map(([id,label,rule])=>
                <div key={id} onClick={()=>{setBitacora(id);setTempStr("");setPhotoCapture(null);setVoiceState("idle");setVoiceText("");}} style={{display:"flex",alignItems:"center",gap:10,padding:"12px",borderRadius:10,border:"1px solid rgba(139,184,57,.1)",marginBottom:6,cursor:"pointer",background:"rgba(139,184,57,.02)",transition:"all .15s"}}>
                  <Ic d="M14 14.76V3a2 2 0 10-4 0v11.76a4 4 0 104 0z" color={K}/>
                  <div style={{flex:1}}><div style={{fontSize:13,fontWeight:500,color:SP}}>{label}</div><div style={{fontSize:10,color:K,opacity:.4}}>{rule}</div></div>
                  <Ic d="M9 18l6-6-6-6" color={GJ} size={14}/>
                </div>
              )}
            </>}

            {!act&&<div style={{marginTop:10,padding:14,borderRadius:10,background:"rgba(223,246,166,.08)",border:"1px dashed rgba(139,184,57,.15)",textAlign:"center"}}>
              <Ic d="M6 21c4-4 6-8 6-14 0 6 2 10 6 14" color={GJ} size={20}/>
              <div style={{fontSize:12,color:K,opacity:.4,marginTop:6}}>Esta área está germinando — nutriéndose de tus procesos para florecer pronto</div>
              <div style={{fontSize:11,color:GJ,opacity:.4,marginTop:4}}>Sube tus formatos para que LiTa los integre</div>
            </div>}
          </>;
        })()}
      </div>}

      {/* === BITACORA TEMPERATURA === */}
      {bitacora&&<div style={{animation:"fadeUp .3s ease"}}>
        <div onClick={()=>setBitacora(null)} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,color:K,opacity:.5,cursor:"pointer",marginBottom:10}}>
          <Ic d="M15 18l-6-6 6-6" color={K} size={14}/> Inocuidad
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <div>
            <div style={{fontSize:17,fontWeight:500,color:SP}}>{bitacora==="cong"?"Congelación":bitacora==="refri"?"Refrigeración":"Conservación"}</div>
            <div style={{fontSize:10,color:K,opacity:.4}}>{today()}</div>
          </div>
          <div style={{padding:"4px 10px",borderRadius:16,fontSize:11,fontWeight:500,color:isOOR?"#A32D2D":K,background:isOOR?"rgba(252,235,235,.5)":"rgba(139,184,57,.08)",border:`1px solid ${isOOR?"rgba(226,75,74,.15)":"rgba(139,184,57,.12)"}`,transition:"all .3s"}}>
            Límite: {bitacora==="cong"?"-18":"4"}°C
          </div>
        </div>

        {/* TEMP DISPLAY */}
        <div style={{height:60,borderRadius:12,border:`2px solid ${isOOR?"#E24B4A":tempStr?GJ:CW}`,background:isOOR?"rgba(252,235,235,.3)":tempStr?"rgba(139,184,57,.02)":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,fontWeight:500,color:isOOR?"#A32D2D":SP,fontFamily:"var(--font-mono)",marginBottom:10,transition:"all .3s"}}>
          {tempStr||<span style={{opacity:.12}}>--</span>}{tempStr?"°":""}
        </div>

        {isOOR&&<div style={{padding:"8px 10px",borderRadius:8,background:"rgba(252,235,235,.3)",border:"1px solid rgba(226,75,74,.12)",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
          <Ic d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" color="#E24B4A" size={16}/>
          <span style={{fontSize:11,color:"#A32D2D",fontWeight:500}}>Fuera de rango — foto y justificación requeridas</span>
        </div>}

        {/* NUMPAD */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:5,marginBottom:12}}>
          {[1,2,3,4,5,6,7,8,9,"-","0","del"].map(k=>
            <div key={k} onClick={()=>handleNumKey(String(k))} style={{height:44,borderRadius:8,border:"1px solid rgba(0,80,86,.06)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:k==="del"?12:18,fontWeight:500,color:k==="del"?"#A32D2D":SP,cursor:"pointer",background:"var(--color-background-primary)",fontFamily:"var(--font-mono)",transition:"all .1s"}}>
              {k==="-"?"+/-":k==="del"?"borrar":k}
            </div>
          )}
        </div>

        {/* PHOTO */}
        <div onClick={()=>{setPhotoCapture(prev=>prev?null:{time:now(),gps:"19.0414,-98.2063"});if(!photoCapture)addAudit("Foto","Capturada con sello GPS");}} style={{border:`2px dashed ${isOOR&&!photoCapture?"#E24B4A":"rgba(139,184,57,.2)"}`,borderRadius:10,padding:14,textAlign:"center",cursor:"pointer",marginBottom:10,background:photoCapture?"rgba(139,184,57,.03)":"transparent",borderStyle:photoCapture?"solid":"dashed"}}>
          {photoCapture?<>
            <Ic d="M5 12l5 5L20 7" color={GJ} size={20}/>
            <div style={{fontSize:11,color:K,fontWeight:500,marginTop:2}}>Foto capturada</div>
            <div style={{fontSize:9,color:K,opacity:.3,fontFamily:"var(--font-mono)"}}>{photoCapture.time} · GPS:{photoCapture.gps} · SELLO LITA</div>
          </>:<>
            <Ic d="M3 7a2 2 0 012-2h3l2-2h4l2 2h3a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7zM12 13a3 3 0 100-6 3 3 0 000 6z" color={isOOR?"#E24B4A":K} size={20}/>
            <div style={{fontSize:11,color:isOOR?"#A32D2D":K,opacity:isOOR?.7:.4,marginTop:2}}>{isOOR?"Foto obligatoria — toca aquí":"Toca para tomar foto (opcional)"}</div>
          </>}
        </div>

        {/* VOICE */}
        <div onClick={()=>{
          if(voiceState==="done"){setVoiceState("idle");setVoiceText("");return;}
          if(voiceState==="recording"){
            setVoiceState("done");
            setVoiceText("Se detectó puerta abierta del congelador por 10 minutos");
            addAudit("Voz","Transcripción completada");return;
          }
          setVoiceState("recording");addAudit("Voz","Grabando...");
        }} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",borderRadius:10,border:`1px solid ${voiceState==="recording"?"rgba(226,75,74,.2)":voiceState==="done"?"rgba(139,184,57,.15)":"rgba(0,80,86,.06)"}`,background:voiceState==="recording"?"rgba(252,235,235,.2)":voiceState==="done"?"rgba(139,184,57,.03)":"transparent",cursor:"pointer",marginBottom:12}}>
          {voiceState==="done"?<Ic d="M5 12l5 5L20 7" color={GJ} size={16}/>:voiceState==="recording"?<div style={{width:10,height:10,borderRadius:5,background:"#E24B4A",animation:"blink 1s infinite"}}/>:<Ic d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zM19 10v2a7 7 0 01-14 0v-2M12 19v4" color={isOOR?"#E24B4A":K} size={16}/>}
          <div style={{flex:1,fontSize:12,color:voiceState==="recording"?"#A32D2D":voiceState==="done"?K:isOOR?"#A32D2D":"rgba(0,80,86,.4)"}}>
            {voiceState==="done"?<><div style={{fontWeight:500}}>Nota transcrita</div><div style={{fontSize:11,opacity:.6,fontStyle:"italic"}}>"{voiceText}"</div></>:voiceState==="recording"?"Grabando... toca para detener":isOOR?"Graba justificación por voz (requerido)":"Toca para grabar observación"}
          </div>
        </div>

        {/* SAVE */}
        {(()=>{
          const canSave=tempStr&&(!isOOR||(photoCapture&&voiceState==="done"));
          return <button onClick={canSave?saveTempEntry:undefined} style={{width:"100%",height:44,border:"none",borderRadius:10,background:canSave?K:"rgba(0,80,86,.06)",color:canSave?CO:"rgba(0,80,86,.2)",fontSize:14,fontWeight:500,cursor:canSave?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <Ic d="M12 5v14M5 12h14" color={canSave?CO:"rgba(0,80,86,.15)"} size={16}/>
            Registrar lectura
          </button>;
        })()}

        {/* ENTRIES */}
        {tempEntries.length>0&&<div style={{marginTop:14}}>
          <div style={{fontSize:12,fontWeight:500,color:SP,marginBottom:6}}>Registros ({tempEntries.length})</div>
          {tempEntries.map((e,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",borderRadius:8,border:`1px solid ${e.oor?"rgba(226,75,74,.1)":"rgba(139,184,57,.08)"}`,background:e.oor?"rgba(252,235,235,.2)":"rgba(139,184,57,.02)",marginBottom:4}}>
            <div style={{fontSize:20,fontWeight:500,color:e.oor?"#A32D2D":K,minWidth:48,textAlign:"center",fontFamily:"var(--font-mono)"}}>{e.temp}°</div>
            <div style={{flex:1}}>
              <div style={{fontSize:11,color:SP}}>{e.time}</div>
              {e.voice&&<div style={{fontSize:10,color:SP,opacity:.5,fontStyle:"italic"}}>"{e.voice}"</div>}
            </div>
            <div style={{display:"flex",gap:3}}>
              <Badge text={e.oor?"Alerta":"OK"} color={e.oor?"#A32D2D":K} bg={e.oor?"rgba(226,75,74,.08)":"rgba(139,184,57,.08)"}/>
              {e.photo&&<Badge text="Foto" color="#0C447C" bg="rgba(151,185,255,.1)"/>}
            </div>
          </div>)}
        </div>}

        {/* SOP CONTEXTUAL */}
        {isOOR&&<div style={{marginTop:12,padding:"10px 12px",borderRadius:8,border:"1px solid rgba(151,185,255,.15)",background:"rgba(151,185,255,.03)"}}>
          <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:4}}>
            <Ic d="M4 4h6a2 2 0 012 2v14a1 1 0 00-1-1H4V4zM20 4h-6a2 2 0 00-2 2v14a1 1 0 011-1h7V4z" color={BB} size={14}/>
            <span style={{fontSize:11,fontWeight:500,color:"#0C447C"}}>SOP: Acción correctiva por temperatura</span>
          </div>
          <div style={{fontSize:10,color:"#0C447C",opacity:.6,lineHeight:1.5}}>
            1. Verificar termómetro funcione correctamente<br/>
            2. Revisar puerta del equipo bien cerrada<br/>
            3. Si producto lleva +2hrs fuera de rango: descartar<br/>
            4. Notificar al Chef de turno inmediatamente
          </div>
        </div>}
      </div>}

      <div style={{textAlign:"center",marginTop:16,fontSize:9,color:"rgba(0,80,86,.12)"}}>Protegido por LiTa support · Audit trail activo · v1.0.0</div>
    </div>
  </div>;
}
