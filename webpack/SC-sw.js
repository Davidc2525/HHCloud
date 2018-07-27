var options = {
			method: 'GET', 
			mode: 'cors',
			headers: {
				'Accept': 'application/json',
			},
			credentials:"include"
			//body: (fd)
		}

function showNotification() {
  Notification.requestPermission(function(result) {
    if (result === 'granted') {
      navigator.serviceWorker.ready.then(function(registration) {
        registration.showNotification('Vibration Sample', {
          body: 'Buzz! Buzz!',
          icon: '../images/touch/chrome-touch-icon-192x192.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: 'vibration-sample'
        });
      });
    }
  });
}

 self.addEventListener('fetch', function(event) {
 return
  var save=new URL(event.request.url).searchParams.get("save")
  if(!new Boolean(save)){
    console.warn("debuelto",event)
    return;
  }
 	console.warn("cacheado",self,event ,event.request)
 	event.respondWith(caches.match(event.request).then(function(response) {
 		// caches.match() always resolves
 		// but in case of success response will have value
 		if (response !== undefined) {
 			return response;
 		} else {
 			return fetch(event.request).then(function(response) {
 				// response may be used only once
 				// we need to save clone to put one copy in cache
 				// and serve second one
 				let responseClone = response.clone();

 				caches.open('fetchs').then(function(cache) {

 					cache.put(event.request, responseClone);
 				});
 				return response;
 			}).catch(function() {
 				return caches.match('/sw-test/gallery/myLittleVader.jpg');
 			});
 		}
 	}));
 });