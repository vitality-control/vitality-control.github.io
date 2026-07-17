/* VK Supabase Init — vitality-kitchen · DMZ · 2026 */
var VK_SB_URL='https://nivloptdmunxtokyddlj.supabase.co';
var VK_SB_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmxvcHRkbXVueHRva3lkZGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQxNDQyNTksImV4cCI6MjA5OTcyMDI1OX0.IF9fbn28k38LIWGzSrUcysoJscH2d7FrH_V20XfT8pk';
var vkSB=null;

function initSB(){
  if(typeof window.supabase==='undefined'||vkSB)return;
  try{vkSB=window.supabase.createClient(VK_SB_URL,VK_SB_KEY);}catch(e){}
}

function sbUpsertProgreso(subId,pct,total,ok,datos){
  try{
    initSB(); if(!vkSB)return;
    var usr=typeof CU!=='undefined'&&CU?CU.email:'';
    vkSB.from('modulo_progreso').upsert({
      modulo_id:subId,area:subId.split('-')[0],
      fecha:new Date().toISOString().slice(0,10),
      usuario:usr,total_items:total,items_ok:ok,pct:pct,
      datos:datos||{},updated_at:new Date().toISOString()
    },{onConflict:'modulo_id,fecha'}).then(function(){}).catch(function(e){console.warn('[SB-P]',e.message);});
  }catch(e){}
}

function sbUpsertDisplay(area,semanaKey,dataObj){
  try{
    initSB(); if(!vkSB)return;
    var usr=typeof CU!=='undefined'&&CU?CU.email:'';
    vkSB.from('display_sabores').upsert({
      area:area,semana_key:semanaKey,
      proyecto:dataObj.proyecto||'Vitality Kitchen',
      elaboro:dataObj.elaboro||'',reviso:dataObj.reviso||'',
      obs:dataObj.obs||'',filas:dataObj.rows||[],
      actualizado_por:usr,updated_at:new Date().toISOString()
    },{onConflict:'area,semana_key'}).then(function(){}).catch(function(e){console.warn('[SB-D]',e.message);});
  }catch(e){}
}

function sbInsertAlerta(tipo,severidad,titulo,mensaje,moduloId){
  try{
    initSB(); if(!vkSB)return;
    vkSB.from('alertas').insert({
      tipo:tipo,severidad:severidad,titulo:titulo,mensaje:mensaje,
      modulo_id:moduloId,fecha:new Date().toISOString().slice(0,10)
    }).then(function(){}).catch(function(){});
  }catch(e){}
}
