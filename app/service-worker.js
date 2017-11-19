var CACHE_NAME = 'static-cache';

var staticFilesToCache = [
    'index.html',
    'js/app.js',
    // js files
    'bower_components/jquery/dist/jquery.min.js',
    'bower_components/bootstrap/dist/js/bootstrap.min.js',
    'bower_components/moment/min/moment.min.js',

    // css files
    'bower_components/bootstrap/dist/css/bootstrap.min.css',
    'bower_components/font-awesome/css/font-awesome.min.css'
];

self.addEventListener('install', function (event) {
    console.log('Service worker installing');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function (cache) {
                return cache.addAll(staticFilesToCache)
            })
    )

});

self.addEventListener('activate', function (event) {
    console.log('Service worker activating');
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                return response || fetchAndCache(event.request);
            })
    );
});

function fetchAndCache(url) {
    return fetch(url)
        .then(function(response) {
            console.log("response : ", response);
            // Check if we received a valid response
            if (!response.ok && response.type == 'basic') {
                throw Error(response.statusText);
            }
            return caches.open(CACHE_NAME)
                .then(function(cache) {
                    cache.put(url, response.clone());
                    return response;
                });
        })
        .catch(function(error) {
            console.log('Request failed:', error);
            // You could return a custom offline 404 page here
        });
}