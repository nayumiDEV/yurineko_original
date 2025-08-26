export default function displayNotification() { 
    //check devices suport to each type of notification
  if (Notification.permission == 'granted') {
    navigator.serviceWorker.getRegistration().then(function (reg) {
      var options = {
        body: 'Here is a notification body!',
        icon: 'icons/icon-16x16.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: 1,
        },
        actions: [
          { action: 'explore', title: 'Explore this new world', icon: 'icons/icon-16x16.png' },
          { action: 'close', title: 'Close notification', icon: 'icons/icon-16x16.png' },
        ],
      }
      reg.showNotification('Hello world!', options)
    })
  }
}

export function checkNotificationPermission() {
  if (Notification.permission === 'granted') {
    return 'granted'
  } else if (Notification.permission === 'blocked') {
    return 'blocked'
  } else {
    return 'denied'
  }
}
