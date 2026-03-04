const CACHE_NAME = 'local-pwa-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.png',
  '/app.js',
  '/bg.png',
  '/RobotoFlex-VariableFont_GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC,opsz,slnt,wdth,wght.ttf',
  '/camera.6af3398a7aff653bb9dbb034a57a4111.png',
  '/download.svg',
  '/jquery.min.js',
  '/jquery.qrcode.min.js',
  '/name.txt',
  '/password.f36456584862850105cf3b32f8086137.png',
  '/service-worker.js',
  '/styles.css',
  '/username.1a1e028fff62438b9e32f10d4aeff6b8.png',
];

// Caching assets khi Service Worker được cài đặt
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetching từ cache khi không có kết nối
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
