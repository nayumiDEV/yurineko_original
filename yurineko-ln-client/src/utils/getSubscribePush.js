export default function getSubscribePush() {
  return new Promise((resolve, reject) => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('sw.js')
        .then(function (reg) {
          reg.pushManager.getSubscription().then(function (sub) {
            if (sub === null) {
              // Update UI to ask user to register for Push
              console.log('Not subscribed to push service!')
              reject(false)
            } else {
              // We have a subscription, update the database
              console.log('Subscription object: ', sub)
              resolve(sub)
            }
          })
        })
        .catch(function (err) {
          console.log('Service Worker registration failed: ', err)
          reject(false)
        })
    }
  })
}
