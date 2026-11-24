const C='study-nest-v13';
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(['./','./icon-192.png'])).catch(()=>{}))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* Fast shell: answer from the cache at once, refresh it quietly in the background.
   Only this site's own files are handled. Papers (Supabase), CDN scripts, fonts and
   partial (Range) requests go straight to the network and are never stored. */
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin||r.headers.has('range'))return;
  e.respondWith(caches.match(r).then(hit=>{
    const net=fetch(r).then(res=>{
      if(res&&res.status===200&&res.type==='basic'){const cp=res.clone();e.waitUntil(caches.open(C).then(c=>c.put(r,cp)).catch(()=>{}))}
      return res;
    }).catch(()=>null);
    if(hit){e.waitUntil(net);return hit}
    return net.then(res=>res||caches.match('./')||Response.error());
  }));
});
