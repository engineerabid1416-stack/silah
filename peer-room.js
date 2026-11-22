/* Claude'suz çok oyunculu: PeerJS (WebRTC) ile 'room' API'sinin yerine geçer. İlk gelen ID'yi alan oda sahibi olur. */
if(!window.claude)window.claude={use:async()=>({join:makeRoom})};
function makeRoom(name){const id='valo3d-'+name;
return new Promise((res,rej)=>{
 const H={},pl=[],peers=new Map(),conns=new Map();let me,mine={},isHost=false,hostConn=null,peer,done=0;
 const fire=(left=[])=>{const arr=[...peers].map(([k,v])=>({peer:k,isMe:k===me,presence:v}));pl.slice().forEach(f=>f({peers:arr,left}))};
 const deliver=(topic,data,from)=>(H[topic]||[]).forEach(f=>f({topic,data,peer:from,isMe:from===me}));
 const bc=(m,ex)=>conns.forEach((c,k)=>{if(k!==ex&&c.open)c.send(m)});
 const api={
  emit(topic,data){if(isHost)bc({t:'e',topic,data,from:me});else if(hostConn&&hostConn.open)hostConn.send({t:'e',topic,data});return Promise.resolve()},
  on(topic,f){(H[topic]=H[topic]||[]).push(f);return()=>{}},
  presence(p){Object.assign(mine,p);peers.set(me,{...mine});if(isHost)bc({t:'p',id:me,p:mine});else if(hostConn&&hostConn.open)hostConn.send({t:'p',p:mine});fire();return Promise.resolve()},
  onPeers(f){pl.push(f);return()=>{}},
  leave(){try{peer.destroy()}catch(e){}return Promise.resolve()},
  connected(){return true}};
 const ok=()=>{if(!done){done=1;res(api)}};
 peer=new Peer(id);
 peer.on('open',()=>{isHost=true;me=id;peers.set(me,{});
  peer.on('connection',c=>{
   c.on('open',()=>{conns.set(c.peer,c);peers.set(c.peer,{});peers.forEach((p,k)=>{if(k!==c.peer)c.send({t:'p',id:k,p})});fire()});
   c.on('data',m=>{if(m.t==='e'){deliver(m.topic,m.data,c.peer);bc({t:'e',topic:m.topic,data:m.data,from:c.peer},c.peer)}
    else if(m.t==='p'){peers.set(c.peer,m.p);bc({t:'p',id:c.peer,p:m.p},c.peer);fire()}});
   c.on('close',()=>{conns.delete(c.peer);peers.delete(c.peer);bc({t:'l',id:c.peer});fire([{peer:c.peer}])})});
  ok()});
 peer.on('error',e=>{
  if(e.type==='unavailable-id'){try{peer.destroy()}catch(x){}
   peer=new Peer();
   peer.on('error',()=>{if(!done){done=1;rej(new Error('baglanti'))}});
   peer.on('open',pid=>{me=pid;peers.set(me,{});hostConn=peer.connect(id,{reliable:true});
    hostConn.on('open',ok);
    hostConn.on('data',m=>{if(m.t==='e')deliver(m.topic,m.data,m.from);
     else if(m.t==='p'){peers.set(m.id,m.p);fire()}
     else if(m.t==='l'){peers.delete(m.id);fire([{peer:m.id}])}});
    hostConn.on('close',()=>{peers.forEach((v,k)=>{if(k!==me)peers.delete(k)});fire()});
    setTimeout(()=>{if(!done){done=1;rej(new Error('zaman asimi'))}},10000)})}
  else if(!done){done=1;rej(e)}});
})}
