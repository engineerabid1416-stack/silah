const $=i=>document.getElementById(i),T=THREE;
if('ontouchstart' in window||navigator.maxTouchPoints>0)document.body.classList.add('touch');
$('nm').value='Oyuncu'+Math.floor(Math.random()*90+10);
const ren=new T.WebGLRenderer({canvas:$('c'),antialias:true});ren.setPixelRatio(Math.min(devicePixelRatio,1.75));
const scene=new T.Scene(),cam=new T.PerspectiveCamera(75,1,.05,200);cam.rotation.order='YXZ';
scene.background=new T.Color(0x8fb6d9);scene.fog=new T.Fog(0x8fb6d9,35,120);
scene.add(new T.HemisphereLight(0xffffff,0x556677,1.1),cam);
const sun=new T.DirectionalLight(0xffffff,.9);sun.position.set(30,50,20);scene.add(sun);
function rs(){ren.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}addEventListener('resize',rs);rs();
// ---- harita (herkeste aynı) ----
const solids=[],boxes=[];
function box(x,z,w,h,d,col){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshLambertMaterial({color:col}));m.position.set(x,h/2,z);scene.add(m);solids.push(m);boxes.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,top:h})}
const fl=new T.Mesh(new T.PlaneGeometry(100,100),new T.MeshLambertMaterial({color:0x3a4650}));fl.rotation.x=-Math.PI/2;scene.add(fl,new T.GridHelper(100,50,0x667788,0x4a5866));solids.push(fl);
[[0,-40,82,6,2],[0,40,82,6,2],[-40,0,2,6,82],[40,0,2,6,82]].forEach(a=>box(a[0],a[1],a[2],a[3],a[4],0x5b6573));
let sd=7;const sr=()=>(sd=sd*16807%2147483647)/2147483647;
for(let i=0;i<28;i++){const w=2+sr()*5,d=2+sr()*5,h=[1,1,2.5,3.5,4.5][i%5];box((sr()-.5)*72,(sr()-.5)*72,w,h,d,[0xd9506a,0x4fb6a5,0xe0b45a,0x7a85d6][i%4])}
const blocked=(x,z,y)=>boxes.some(b=>x>b.x0-.35&&x<b.x1+.35&&z>b.z0-.35&&z<b.z1+.35&&y<b.top-.25);
const gnd=(x,z,y)=>{let g=0;for(const b of boxes)if(x>b.x0-.2&&x<b.x1+.2&&z>b.z0-.2&&z<b.z1+.2&&b.top<=y+.35&&b.top>g)g=b.top;return g};
// ---- silahlar ----
const W=[{n:'Classic',mz:-.32,p:0,d:26,rate:.2,mag:12,auto:0,fov:60,sp:.012,own:1},{n:'Sheriff',mz:-.46,p:400,d:55,rate:.45,mag:6,auto:0,fov:55,sp:.006},{n:'Vandal',mz:-.75,p:1000,d:40,rate:.1,mag:25,auto:1,fov:50,sp:.015},{n:'Operator',mz:-1.2,p:1500,d:120,rate:1.1,mag:5,auto:0,fov:20,sp:.001}];
W.forEach(w=>{w.inv=0;w.ammo=w.mag;w.res=w.mag*3;w.own=w.own||0});
const dmg=w=>w.d+w.inv/10;
const P={x:0,y:0,z:0,vy:0,yaw:0,pitch:0,ch:1.65,hp:100,cred:2500,heals:2,fl:2,sm:2,k:0,d:0,dead:0,cur:0,rl:0,nx:0,t:0,healT:0,blind:0,dmgT:0,mf:0,og:1,fh:0,name:'Oyuncu'};
const gm=(w,h,d,c,x,y,z)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshLambertMaterial({color:c}));m.position.set(x,y,z);return m};
const gun=new T.Group();gun.position.set(.22,-.2,-.5);cam.add(gun);
const wm=[
 [[.07,.08,.32,0x9aa5b1,0,.03,-.1],[.06,.05,.28,0x2b3138,0,-.02,-.08],[.055,.15,.07,0x1a1d21,0,-.1,.04],[.03,.03,.06,0x111111,0,.03,-.28],[.02,.025,.02,0xff4655,0,.08,.04]],
 [[.04,.04,.42,0xc0c8d0,0,.04,-.24],[.075,.075,.1,0x8a939d,0,.03,-.03],[.06,.09,.2,0x3a424b,0,.02,.06],[.055,.16,.07,0x6b4a2f,0,-.1,.08],[.02,.04,.03,0x111111,0,.09,.12],[.03,.03,.04,0x111111,0,.07,-.44]],
 [[.07,.09,.5,0x3a4350,0,0,-.05],[.03,.03,.3,0x111111,0,.02,-.55],[.08,.07,.28,0x2b3138,0,-.01,-.4],[.05,.17,.07,0x1f242a,0,-.13,-.08],[.06,.1,.22,0x2b3138,0,-.02,.3],[.03,.04,.1,0x111111,0,.07,-.2],[.072,.02,.2,0xff4655,0,.05,-.05],[.045,.045,.06,0x111111,0,.02,-.72]],
 [[.07,.1,.6,0x2f3a2f,0,0,-.05],[.035,.035,.7,0x111111,0,.02,-.7],[.065,.065,.32,0x111111,0,.1,-.15],[.07,.07,.03,0x4fb6ff,0,.1,-.32],[.03,.04,.04,0x222222,0,.06,-.05],[.03,.04,.04,0x222222,0,.06,-.28],[.05,.1,.08,0x1f242a,0,-.1,-.05],[.07,.12,.28,0x2f3a2f,0,-.02,.3],[.055,.055,.08,0x111111,0,.02,-1.05]]
].map(a=>{const g=new T.Group();a.forEach(p=>g.add(gm(...p)));gun.add(g);return g});
const mfl=new T.Mesh(new T.BoxGeometry(.12,.12,.1),new T.MeshBasicMaterial({color:0xffd34d}));mfl.position.set(0,.03,-.32);mfl.visible=false;gun.add(mfl);
// ---- şarjör değiştirme animasyonu ----
const MG=[[.05,.12,.06,0x8a8f96,0,-.15,.04],[.05,.12,.06,0x8a8f96,0,-.15,.08],[.05,.15,.06,0x2a2f36,0,-.1,.14],[.05,.1,.06,0x1f2a1f,0,-.07,.12]];
const mags=MG.map((a,i)=>{const m=gm(...a);m.userData.b=m.position.clone();wm[i].add(m);return m});
const lh=new T.Group();lh.add(gm(.08,.08,.1,0xf2c9a0,0,0,0),gm(.09,.09,.22,0x2a3340,-.01,-.02,.16));lh.visible=false;gun.add(lh);
const ez=x=>x<=0?0:x>=1?1:x*x*(3-2*x),lv=(a,b,k)=>a.clone().lerp(b,k);
function dropMag(mg){const d=new T.Mesh(mg.geometry,mg.material);d.position.copy(mg.getWorldPosition(new T.Vector3()));scene.add(d);fxs.push({k:'m',g:d,v:new T.Vector3((Math.random()-.5)*1.2,.4,1.2),t:2.5})}
function reloadAnim(dt){const mg=mags[P.cur],b=mg.userData.b,k=Math.min(1,dt*16);
 mags.forEach((m,i)=>{if(i!==P.cur){m.position.copy(m.userData.b);m.visible=true}});
 let tilt=0,pz=0,h=null;mg.visible=true;mg.position.copy(b);
 if(P.rl>0){const u=1-P.rl/P.rlT;tilt=ez(u/.15)-ez((u-.86)/.14);
  const tH=new T.Vector3(b.x-.06,b.y-.02,b.z),bH=tH.clone().add(new T.Vector3(0,-.4,0)),aw=new T.Vector3(-.28,-.45,b.z+.12),off=new T.Vector3(.06,.02,0);
  if(u<.15)h=lv(aw,tH,ez(u/.15));
  else if(u<.35){const q=ez((u-.15)/.2);mg.position.set(b.x,b.y-.4*q,b.z);h=tH.clone();h.y-=.4*q}
  else if(u<.5){mg.visible=false;h=lv(bH,aw,ez((u-.35)/.15))}
  else if(u<.62){h=lv(aw,bH,ez((u-.5)/.12));mg.position.copy(h).add(off)}
  else if(u<.74){h=lv(bH,tH,ez((u-.62)/.12));mg.position.copy(h).add(off)}
  else if(u<.88)h=lv(tH,aw,ez((u-.74)/.14));
  if(u>=.35&&!P.dropped){P.dropped=1;dropMag(mg)}
  if(u>.7&&u<.8)pz+=Math.sin((u-.7)/.1*Math.PI)*.04;
  if(u>.88&&u<.97)pz+=Math.sin((u-.88)/.09*Math.PI)*.05}
 lh.visible=!!h;if(h)lh.position.copy(h);
 gun.rotation.z+=(-.55*tilt-gun.rotation.z)*k;gun.rotation.x+=(.3*tilt-gun.rotation.x)*k;
 gun.position.y+=(-.2-.04*tilt-gun.position.y)*k;gun.position.z+=(-.5+pz-gun.position.z)*Math.min(1,dt*15)}
// ---- yürüme animasyonu (kol/bacak) ----
function animP(p,sp,dt){const L=p.L;if(!L)return;p.ph=(p.ph||0)+dt*sp*2.2;const a=Math.min(1,sp/3),s=Math.sin(p.ph)*a,c=Math.cos(p.ph)*a;
 L.l.hp.rotation.x=s*.85;L.r.hp.rotation.x=-s*.85;
 L.l.kn.rotation.x=-Math.max(0,c);L.r.kn.rotation.x=-Math.max(0,-c);
 L.ra.sh.rotation.x=1.2+s*.15;L.ra.el.rotation.x=.35;
 L.la.sh.rotation.x=1.0-s*.3;L.la.el.rotation.x=.5;
 L.tor.position.y=Math.abs(c)*.03;L.tor.rotation.y=s*.08}
