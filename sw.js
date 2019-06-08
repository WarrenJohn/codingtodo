const cacheName = 'v2'
const cacheFiles = [
    '/',
    'blog/',
    '/static/swApp.js',
    '/static/js/todo.js',
    '/static/js/main.js',
    '/static/js/article.js',
    '/static/css/master.css',
    '/static/images/mobilemenu.png',
    '/static/images/favicon/android-icon-192x192.png',
    '/static/images/favicon/favicon-16x16.png',
    'https://fonts.googleapis.com/css?family=Lato:300,400,700&display=swap'
]

self.addEventListener('install', e => {
    // console.log('[ServiceWorker] Install Event');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                // console.log('[ServiceWorker] Caching Files');
                cache.addAll(cacheFiles);
            })
            .then(() =>
                self.skipWaiting()
            )
    );
});

self.addEventListener('activate', e => {
    // console.log('[ServiceWorker] Activated');
    e.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if(cache !== cacheName){
                            // console.log('[ServiceWorker] Delete old cache');
                            return caches.delete(cache);
                        }
                    })
                )
            })
    )

});


self.addEventListener('fetch', e => {
    // console.log('[ServiceWorker] Fetch Event');
    e.respondWith(
        fetch(e.request)
            .then(res => {
                const clone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, clone);
                    })
                return res;
            })
            .catch(err => caches.match(e.request)
                .then(res => {return res})
            )
    )
})
