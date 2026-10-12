self.addEventListener('install', (e) => {
  console.log('Service Worker yüklendi');
});

self.addEventListener('fetch', (e) => {
  // Temel ağ isteklerini dinler ve çevrimdışı altyapı sağlar
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
