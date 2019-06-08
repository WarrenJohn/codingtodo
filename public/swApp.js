if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/static/sw.js')
    // .register('/sw.js', {scope: './'})
    .then(function(registration) {
        console.log('[ServiceWorker] Registration succeeded. Scope is ' + registration.scope);
        // registration.unregister()
    })
    .catch(function(err) {
        console.log('Registration failed with ' + err);
    });
};
