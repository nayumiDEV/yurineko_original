self.__WB_DISABLE_DEV_LOGS = true

// handle notification close
self.addEventListener('notificationclose', function (e) {
  var notification = e.notification
  var primaryKey = notification.data.primaryKey

  // console.log('Closed notification: ' + primaryKey)
})

self.addEventListener('notificationclick', function (e) {
  var notification = e.notification
  var primaryKey = notification.data.primaryKey
  var action = e.action
  var payload = notification.data.payload

  if (action === 'close') {
    notification.close()
  } else {
    clients.openWindow(payload.url)
    notification.close()
  }
})

//listen for push event
self.addEventListener('push', function (event) {
  const notify = JSON.parse(event.data.text())

  const title = notify.title
  const options = {
    body: notify.body,
    icon: 'icons/icon-144.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      payload: notify,
    },
    actions: [
      { action: 'explore', title: 'Xem ngay' },
      { action: 'close', title: 'Đóng' },
    ],
  }

  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclose', function (e) {
  var notification = e.notification
  var primaryKey = notification.data.primaryKey

  // console.log('Closed notification: ' + primaryKey)
})
