if ('serviceWorker' in navigator) {
    navigator.serviceWorker
    .register('/sw.js')
    // .register('/sw.js', {scope: './'})
    .then(function(registration) {
        // console.log('[ServiceWorker] Registration succeeded. Scope is ' + registration.scope);
    })
    .catch(function(err) {
        // console.log('Registration failed with ' + err);
    });
};
