import urlB64ToUint8Array from './urlB64ToUint8Array'

export default function subscribePush() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      .then(function (reg) {
        // console.log('Service Worker Registered!', reg)
        const applicationServerKey = urlB64ToUint8Array(process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY)
        reg.pushManager
          .subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey,
          })
          .then(function (subscription) {
            // console.log('User is subscribed.')
            console.log(JSON.stringify(subscription))
          })
          .catch(function (err) {
            console.log('Failed to subscribe the user: ', err)
          })
      })
      .catch(function (err) {
        console.log('Service Worker registration failed: ', err)
      })
  }
}
