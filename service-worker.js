const CACHE_NAME = "hydro-reminder-v1";

const FILES_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json"
];

// تثبيت Service Worker
self.addEventListener("install", event => {

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(FILES_TO_CACHE);
            })
    );

    self.skipWaiting();
});


// تفعيل Service Worker
self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys().then(keys => {

            return Promise.all(

                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))

            );

        })

    );

    self.clients.claim();
});


// تشغيل التطبيق من الكاش عند عدم وجود إنترنت
self.addEventListener("fetch", event => {

    event.respondWith(

        caches.match(event.request)
            .then(response => {

                if (response) {
                    return response;
                }

                return fetch(event.request);

            })
            .catch(() => {

                return caches.match("./index.html");

            })

    );
});
