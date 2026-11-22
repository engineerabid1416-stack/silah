// ---- oyuncular ----
const players={},rc=new T.Raycaster();let rm=null,myId=null,peerL=[],playing=0,showBuy=0;
const hue=id=>{let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))%360;return new T.Color().setHSL(h/360,.7,.55)};
function addP(id,bot){const g=new T.Group(),M=c=>new T.MeshLambertMaterial({color:c}),parts=[];let hh=0;for(const c of id)hh=(hh*31+c.charCodeAt(0))>>>0;
 const skin=[0xf2c9a0,0xdcae82,0xb67b50,0x8a5a3a][hh%4],hair=[0x2b1d14,0x6b4a2f,0xc9a14a,0x111111,0x8a2f2f][(hh>>3)%5],cl=hue(id),dk=0x222831;
 const B=(w,h,d,c,x,y,z,par,hd)=>{const m=new T.Mesh(new T.BoxGeometry(w,h,d),M(c));m.position.set(x,y,z);(par||g).add(m);if(hd!==0){m.userData.pid=id;if(hd)m.userData.head=1;parts.push(m)}return m};
 const J=(x,y,z,par)=>{const o=new T.Group();o.position.set(x,y,z);(par||g).add(o);return o};
 const tor=J(0,0,0);
 B(.5,.62,.28,cl,0,1.14,0,tor);B(.46,.4,.03,0x2b3138,0,1.2,-.155,tor,0);B(.53,.1,.3,0x2b3138,0,.86,0,tor);B(.1,.1,.1,skin,0,1.5,0,tor);
 B(.46,.2,.26,dk,0,.78,0);
 const hd=J(0,1.7,0,tor),hm=new T.Mesh(new T.SphereGeometry(.17,16,12),M(skin));hm.userData.pid=id;hm.userData.head=1;hd.add(hm);parts.push(hm);
 const hr=new T.Mesh(new T.SphereGeometry(.18,16,8,0,Math.PI*2,0,Math.PI*.35),M(hair));hr.position.y=.015;hr.userData.pid=id;hr.userData.head=1;hd.add(hr);parts.push(hr);
 B(.32,.2,.1,hair,0,-.01,.1,hd,1);
 [-1,1].forEach(s=>{B(.06,.04,.02,0xffffff,s*.065,.03,-.152,hd,0);B(.028,.03,.02,0x1a1a1a,s*.065,.028,-.163,hd,0);B(.075,.016,.02,hair,s*.065,.07,-.15,hd,0);B(.03,.06,.04,skin,s*.17,0,0,hd,0)});
 B(.03,.04,.035,skin,0,-.015,-.165,hd,0);B(.07,.014,.02,0x7a2f2f,0,-.075,-.148,hd,0);
 B(.08,.1,.5,0x111111,.2,1.12,-.35,g,0);
 const arm=s=>{const sh=J(s*.33,1.4,0,tor),el=J(0,-.3,0,sh);B(.12,.3,.12,cl,0,-.15,0,sh);B(.1,.28,.1,skin,0,-.14,0,el);B(.1,.1,.1,0x2b3138,0,-.31,0,el);sh.rotation.z=-s*.12;return{sh,el}};
 const leg=s=>{const hp=J(s*.13,.82,0),kn=J(0,-.4,0,hp);B(.18,.4,.2,dk,0,-.2,0,hp);B(.15,.38,.17,0x39424e,0,-.19,0,kn);B(.17,.09,.28,0x111111,0,-.375,-.04,kn);return{hp,kn}};
 const L={tor,l:leg(-1),r:leg(1),la:arm(-1),ra:arm(1)};L.la.sh.rotation.z=.3;
 g.userData.parts=parts;scene.add(g);
 const pl={m:g,id,bot,hp:100,name:bot?'Bot':'?',tx:0,ty:0,tz:0,ry:0,k:0,d:0,wt:0,dir:0,mv:0,L};animP(pl,0,0);players[id]=pl;if(bot)rbot(pl)}
function rbot(p){for(let i=0;i<40;i++){const x=(Math.random()-.5)*70,z=(Math.random()-.5)*70;if(!blocked(x,z,0)){p.m.position.set(x,0,z);return}}}
// ---- efektler ----
const fxs=[],gr=[];
function tracer(a,b){const l=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(...a),new T.Vector3(...b)]),new T.LineBasicMaterial({color:0xffe27a}));scene.add(l);fxs.push({k:'t',g:l,t:.07})}
function boom(k,p){const v=new T.Vector3(...p);
 if(k==='s'){const g=new T.Group(),mat=new T.MeshBasicMaterial({color:0xcfd6dc,transparent:true,opacity:.85,depthWrite:false});
  for(let i=0;i<14;i++){const s=new T.Mesh(new T.SphereGeometry(1.5+Math.random(),10,8),mat);s.position.set((Math.random()-.5)*5,Math.random()*2.5+.8,(Math.random()-.5)*5);g.add(s)}
  g.position.set(v.x,0,v.z);scene.add(g);fxs.push({k,g,mat,t:10});return}
 const g=new T.Mesh(new T.SphereGeometry(.4,10,8),new T.MeshBasicMaterial({color:0xffffff}));g.position.copy(v);scene.add(g);fxs.push({k,g,t:.35});
 const to=cam.position.clone().sub(v),dist=to.length();if(dist>45||P.dead)return;to.normalize();
 rc.set(v,to);rc.far=dist;const occ=rc.intersectObjects(solids,false).length;
 const d=new T.Vector3();cam.getWorldDirection(d);const look=Math.min(1,Math.max(0,(-d.dot(to)+.3)/1.3));
 if(!occ)P.blind=Math.max(P.blind,.8+3.5*(1-dist/45)*look)}
function throwG(k){if(P.dead||!playing)return;if(k==='f'){if(P.fl<1)return;P.fl--}else{if(P.sm<1)return;P.sm--}
 const d=new T.Vector3();cam.getWorldDirection(d);
 const m=new T.Mesh(new T.SphereGeometry(.1,8,8),new T.MeshBasicMaterial({color:k==='f'?0xffffaa:0x9aa5b1}));m.position.copy(cam.position).addScaledVector(d,.5);scene.add(m);
 gr.push({m,k,v:d.clone().multiplyScalar(15).add(new T.Vector3(0,3,0)),t:1.1})}
