export default function displayNotification() {
  if ('Notification' in window && navigator.serviceWorker) {
    // Display the UI to let the user toggle notifications
    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status)
    })
  }
}

export function isSupportNotification() {
  if ('Notification' in window && navigator.serviceWorker) {
    return true
  }
  return false
}
