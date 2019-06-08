const cacheName = 'v2'
const cacheFiles = [
    '/',
    '/blog',
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
    console.log('[ServiceWorker] Install Event');
    e.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('[ServiceWorker] Caching Files');
                cache.addAll(cacheFiles);
            })
            .then(() =>
                self.skipWaiting()
            )
    );
});

self.addEventListener('activate', e => {
    console.log('[ServiceWorker] Activated');
    e.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if(cache !== cacheName){
                            console.log('[ServiceWorker] Delete old cache');
                            return caches.delete(cache);
                        }
                    })
                )
            })
    )

});


self.addEventListener('fetch', e => {
    console.log('[ServiceWorker] Fetch Event');
    e.respondWith(
        fetch(e.request)
            .then(response => {
                const clone = res.clone();
                caches
                    .open(cacheName)
                    .then(cache => {
                        cache.put(e.request, clone);
                    })
                return res;
            })
            .catch(err => caches.match(e.request)
                .then(res => (res))
            )
    )
})
//
// self.addEventListener('fetch', e => {
//     console.log('[ServiceWorker] Fetch Event');
//     e.respondWith(
//         fetch(e.request)
//         .then(res => {
//             const clone = res.clone();
//             caches
//                 .open(cacheName)
//                 .then(cache => {
//                     cache.put(e.request, clone);
//                 });
//             return res;
//         })
//         .catch(err => caches.match(e.request)
//             .then(res => (res))
//         ));
//     );
// });

// self.addEventListener('install', function(event) {
//     console.log('[ServiceWorker] Install Event');
//   event.waitUntil(
//     caches.open(cacheName).then(function(cache) {
//         console.log('[ServiceWorker] Cache Files');
//       return cache.addAll(cacheFiles);
//     })
//   );
// });
//
// self.addEventListener('activate', function(e) {
//     console.log('[ServiceWorker] Activated');
//     e.waitUntil(
//     	// Get all the cache keys (cacheName)
// 		caches.keys().then(function(cacheNames) {
// 			return Promise.all(cacheNames.map(function(thisCacheName) {
// 				// If a cached item is saved under a previous cacheName
// 				if (thisCacheName !== cacheName) {
// 					// Delete that cached file
// 					console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
// 					return caches.delete(thisCacheName);
// 				}
// 			}));
// 		})
// 	); // end e.waitUntil
//
// });
//
// self.addEventListener('fetch', function(e) {
// 	console.log('[ServiceWorker] Fetch', e.request.url);
// 	// e.respondWith Responds to the fetch event
// 	e.respondWith(
// 		// Check in cache for the request being made
// 		caches.match(e.request)
//
// 			.then(function(response) {
// 				// If the request is in the cache
// 				if ( response ) {
// 					console.log("[ServiceWorker] Found in Cache", e.request.url, response);
// 					// Return the cached version
// 					return response;
// 				}
// 				// If the request is NOT in the cache, fetch and cache
// 				const requestClone = e.request.clone();
// 				fetch(requestClone)
// 					.then(function(response) {
// 						if ( !response ) {
// 							console.log("[ServiceWorker] No response from fetch ")
// 							return response;
// 						}
// 						const responseClone = response.clone();
// 						//  Open the cache
// 						caches.open(cacheName).then(function(cache) {
// 							// Put the fetched response in the cache
// 							cache.put(e.request, responseClone);
// 							console.log('[ServiceWorker] New Data Cached', e.request.url);
// 							// Return the response
// 							return response;
// 				        }); // end caches.open
// 					})
// 					.catch(function(err) {
// 						console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
// 					});
// 			}) // end caches.match(e.request)
// 	); // end e.respondWith
// });
