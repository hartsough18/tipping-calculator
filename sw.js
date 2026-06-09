var CACHE_NAME = 'tip-calculator-v6';
var APP_SHELL = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './pwa_manifest.json',
  './icon-192.png',
  './icon-512.png',
  './favicon.svg'
];

// Generate a calculator-style icon as a PNG data URL using OffscreenCanvas
function generateCalcIcon(size) {
  try {
    var canvas = new OffscreenCanvas(size, size);
    var ctx = canvas.getContext('2d');
    var s = size / 32; // scale factor

    // Background rounded rect
    var r = 6 * s;
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.moveTo(r, 0);
    ctx.lineTo(size - r, 0);
    ctx.quadraticCurveTo(size, 0, size, r);
    ctx.lineTo(size, size - r);
    ctx.quadraticCurveTo(size, size, size - r, size);
    ctx.lineTo(r, size);
    ctx.quadraticCurveTo(0, size, 0, size - r);
    ctx.lineTo(0, r);
    ctx.quadraticCurveTo(0, 0, r, 0);
    ctx.closePath();
    ctx.fill();

    // Display bar at top
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    var dispX = 5 * s, dispY = 5 * s, dispW = 22 * s, dispH = 7 * s, dispR = 2 * s;
    ctx.beginPath();
    ctx.moveTo(dispX + dispR, dispY);
    ctx.lineTo(dispX + dispW - dispR, dispY);
    ctx.quadraticCurveTo(dispX + dispW, dispY, dispX + dispW, dispY + dispR);
    ctx.lineTo(dispX + dispW, dispY + dispH - dispR);
    ctx.quadraticCurveTo(dispX + dispW, dispY + dispH, dispX + dispW - dispR, dispY + dispH);
    ctx.lineTo(dispX + dispR, dispY + dispH);
    ctx.quadraticCurveTo(dispX, dispY + dispH, dispX, dispY + dispH - dispR);
    ctx.lineTo(dispX, dispY + dispR);
    ctx.quadraticCurveTo(dispX, dispY, dispX + dispR, dispY);
    ctx.closePath();
    ctx.fill();

    // Button grid: 3 columns x 2 rows
    var cols = [5, 13, 21];
    var rows = [15, 23];
    var btnW = 6 * s, btnH = 5 * s, btnR = 1.5 * s;

    function drawBtn(bx, by, color) {
      bx = bx * s; by = by * s;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(bx + btnR, by);
      ctx.lineTo(bx + btnW - btnR, by);
      ctx.quadraticCurveTo(bx + btnW, by, bx + btnW, by + btnR);
      ctx.lineTo(bx + btnW, by + btnH - btnR);
      ctx.quadraticCurveTo(bx + btnW, by + btnH, bx + btnW - btnR, by + btnH);
      ctx.lineTo(bx + btnR, by + btnH);
      ctx.quadraticCurveTo(bx, by + btnH, bx, by + btnH - btnR);
      ctx.lineTo(bx, by + btnR);
      ctx.quadraticCurveTo(bx, by, bx + btnR, by);
      ctx.closePath();
      ctx.fill();
    }

    // Row 1: 3 regular buttons
    drawBtn(5, 15, 'rgba(255,255,255,0.85)');
    drawBtn(13, 15, 'rgba(255,255,255,0.85)');
    drawBtn(21, 15, 'rgba(255,255,255,0.85)');
    // Row 2: 2 regular + 1 accent (equals)
    drawBtn(5, 23, 'rgba(255,255,255,0.85)');
    drawBtn(13, 23, 'rgba(255,255,255,0.85)');
    drawBtn(21, 23, '#93c5fd');

    return canvas.convertToBlob({ type: 'image/png' });
  } catch (e) {
    return Promise.resolve(null);
  }
}

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      // Try to cache icon blobs generated on the fly
      var iconPromises = [
        generateCalcIcon(192).then(function (blob) {
          if (blob) {
            return cache.put('./icon-192.png', new Response(blob, { headers: { 'Content-Type': 'image/png' } }));
          }
        }).catch(function () {}),
        generateCalcIcon(512).then(function (blob) {
          if (blob) {
            return cache.put('./icon-512.png', new Response(blob, { headers: { 'Content-Type': 'image/png' } }));
          }
        }).catch(function () {})
      ];

      var shellPromise = cache.addAll(
        APP_SHELL.filter(function (u) { return u !== './icon-192.png' && u !== './icon-512.png'; })
          .map(function (url) { return new Request(url, { cache: 'reload' }); })
      ).catch(function () {
        return cache.addAll(['./index.html', './styles.css', './app.js']);
      });

      return Promise.all([shellPromise].concat(iconPromises));
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then(function (networkResponse) {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === 'basic'
        ) {
          var responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
