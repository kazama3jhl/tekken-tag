(function(){
"use strict";
const status=document.getElementById("status");
const canvas=document.getElementById("canvas");
const CORE="emulator/mametiny.js";
const ROM_URL="roms/tekken-tag.zip";
const DRIVER="tektagt";

function setStatus(s){status.textContent=s}

window.Module={
  noInitialRun:false,
  arguments:[DRIVER,"-rompath","/roms","-video","soft","-window","-resolution","640x480"],
  canvas:canvas,
  print:function(t){console.log(t)},
  printErr:function(t){console.warn(t)},
  setStatus:function(t){if(t)setStatus(t)},
  preRun:[],
  postRun:[]
};

Module.preRun.push(function(){
  Module.addRunDependency("tekken-rom");
  fetch(ROM_URL).then(function(r){
    if(!r.ok) throw new Error("ROM HTTP "+r.status);
    return r.arrayBuffer();
  }).then(function(buf){
    try{FS.mkdir("/roms")}catch(e){}
    FS.writeFile("/roms/tektagt.zip",new Uint8Array(buf));
    setStatus("ROM آماده شد؛ در حال اجرای بازی...");
    Module.removeRunDependency("tekken-rom");
  }).catch(function(e){
    setStatus("خطا در بارگذاری ROM: "+e.message);
    Module.removeRunDependency("tekken-rom");
  });
});

function key(name,down){
  const ev=new KeyboardEvent(down?"keydown":"keyup",{key:name,code:name,bubbles:true});
  window.dispatchEvent(ev);
}
document.querySelectorAll("[data-key]").forEach(function(b){
  const k=b.dataset.key;
  b.addEventListener("pointerdown",e=>{e.preventDefault();key(k,true)});
  b.addEventListener("pointerup",e=>{e.preventDefault();key(k,false)});
  b.addEventListener("pointercancel",e=>key(k,false));
  b.addEventListener("pointerleave",e=>{if(e.buttons)key(k,false)});
});
document.getElementById("fullscreen").onclick=function(){
  const el=document.documentElement;
  if(!document.fullscreenElement) el.requestFullscreen&&el.requestFullscreen(); else document.exitFullscreen&&document.exitFullscreen();
};
document.getElementById("pause").onclick=function(){key("p",true);key("p",false)};
document.getElementById("reset").onclick=function(){key("F3",true);key("F3",false)};

setStatus("در حال بارگذاری هسته MAME...");
const script=document.createElement("script");
script.src=CORE;
script.async=false;
script.onload=function(){setStatus("هسته MAME بارگذاری شد؛ در حال اجرای Tekken Tag...")};
script.onerror=function(){setStatus("هسته MAME پیدا نشد: "+CORE)};
document.body.appendChild(script);
})();