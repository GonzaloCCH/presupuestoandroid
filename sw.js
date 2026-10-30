var C="presupuesto2-v17";
var F=["./","index.html","manifest.json","icon-180.png","icon-512.png","icon-192.png","icon-maskable-512.png"];

self.addEventListener("install",function(e){
  e.waitUntil(caches.open(C).then(function(c){
    return Promise.all(F.map(function(u){
      return fetch(new Request(u,{cache:"reload"})).then(function(r){
        if(r&&r.ok)return c.put(u,r);
      }).catch(function(){});
    }));
  }));
  self.skipWaiting();
});

self.addEventListener("activate",function(e){
  e.waitUntil(caches.keys().then(function(k){
    return Promise.all(k.filter(function(n){return n.indexOf("presupuesto2-")===0&&n!==C;}).map(function(n){return caches.delete(n);}));
  }));
  self.clients.claim();
});

self.addEventListener("fetch",function(e){
  if(e.request.method!=="GET")return;
  var u=new URL(e.request.url);
  if(u.origin!==self.location.origin){return;}
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(function(cached){
    var update=fetch(e.request).then(function(r){
      if(r&&r.ok){var copy=r.clone();caches.open(C).then(function(c){c.put(e.request,copy);});}
      return r;
    }).catch(function(){return cached;});
    return cached||update;
  }));
});
