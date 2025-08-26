self.__WB_DISABLE_DEV_LOGS = true

// handle notification close
self.addEventListener('notificationclose', function (e) {
  var notification = e.notification
  var primaryKey = notification.data.primaryKey

  console.log('Closed notification: ' + primaryKey)
})


self.addEventListener('notificationclick', function (e) {
  var notification = e.notification
  var primaryKey = notification.data.primaryKey
  var action = e.action

  if (action === 'close') {
    notification.close()
  } else {
    clients.openWindow('http://www.example.com')
    notification.close()
  }
})

//listen for push event
self.addEventListener('push', function(event) {
    console.log('[Service Worker] Push Received.');
    console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
    const title = 'Push Codelab';
    const options = {
      body: 'Yay it works.',
      icon: 'icons/icon-16x16.png',
      badge: 'icons/icon-16x16.png'
    };
  
    event.waitUntil(self.registration.showNotification(title, options));
  });

  self.addEventListener('notificationclose', function(e) {
  var notification = e.notification;
  var primaryKey = notification.data.primaryKey;

  console.log('Closed notification: ' + primaryKey);
});