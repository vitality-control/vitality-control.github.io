/* LiTa Support — Supabase init + sync multi-dispositivo */
var VK_SB_URL='https://nivloptdmunxtokyddlj.supabase.co';
var VK_SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmxvcHRkbXVueHRva3lkZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNDQyNTksImV4cCI6MjA5OTcyMDI1OX0.IF9fbn28k38LIWGzSrUcysoJscH2d7FrH_V20XfT8pk';
var vkSB=null;
function initSB(){
  if(vkSB)return;
  try{ if(window.supabase&&window.supabase.createClient){ vkSB=window.supabase.createClient(VK_SB_URL,VK_SB_KEY); } }catch(e){}
}
function _fMX(){ return new Date().toLocaleDateString('en-CA',{timeZone:'America/Mexico_City'}); }

/* UP: progreso local → servidor (PK fecha+modulo_id, last-write-wins con mayor pct) */
function sbUpsertProgreso(subId,pct,total,ok,datos){
  try{
    initSB(); if(!vkSB)return;
    var usr=typeof CU!=='undefined'&&CU?CU.email:'';
    vkSB.from('progreso_modulos').upsert({
      fecha:_fMX(), modulo_id:subId, pct:pct,
      items:{total:total,hechos:ok,extra:datos||{}},
      updated_by:usr, updated_at:new Date().toISOString()
    },{onConflict:'fecha,modulo_id'}).then(function(){}).catch(function(){});
  }catch(e){}
}

/* DOWN: servidor → localStorage (server gana si pct mayor). Devuelve true si cambió algo */
function sbDownProgreso(){
  return new Promise(function(resolve){
    try{
      initSB(); if(!vkSB){resolve(false);return;}
      vkSB.from('progreso_modulos').select('modulo_id,pct,items').eq('fecha',_fMX()).then(function(r){
        if(r.error||!r.data||!r.data.length){resolve(false);return;}
        var changed=false;
        var hk=typeof hoyKey==='function'?hoyKey():_fMX();
        r.data.forEach(function(row){
          var key='vk_prog_'+row.modulo_id+'_'+hk;
          var localPct=0;
          try{var v=JSON.parse(localStorage.getItem(key)||'null');localPct=v&&v.pct?v.pct:0;}catch(e){}
          if((row.pct||0)>localPct){
            var it=row.items||{};
            localStorage.setItem(key,JSON.stringify({total:it.total||0,hechos:it.hechos||0,pct:row.pct,ts:Date.now(),srv:true}));
            changed=true;
          }
        });
        resolve(changed);
      }).catch(function(){resolve(false);});
    }catch(e){resolve(false);}
  });
}

/* Alertas → Supabase (dispara email via trigger + Edge Function) */
function sbInsertAlerta(area,severidad,titulo,mensaje,moduloId){
  try{
    initSB(); if(!vkSB)return;
    var k='vk_alert_sent_'+_fMX()+'_'+(moduloId||titulo).replace(/\W/g,'').slice(0,40);
    if(localStorage.getItem(k))return; /* anti-spam: 1 vez al dia por contexto */
    localStorage.setItem(k,'1');
    vkSB.from('alertas').insert({
      tipo:area,severidad:severidad,titulo:titulo,mensaje:mensaje,
      modulo_id:moduloId||'',fecha:_fMX(),leida:false
    }).then(function(){}).catch(function(){});
  }catch(e){}
}

/* Registro genérico (temperaturas/merma usan sus propias tablas via portal) */
function sbInsertRegistro(tabla,payload){
  try{ initSB(); if(!vkSB)return; vkSB.from(tabla).insert(payload).then(function(){}).catch(function(){}); }catch(e){}
}
