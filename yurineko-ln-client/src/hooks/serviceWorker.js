import isClient from '@/utils/isClient'

const pushServerPublicKey =
  'BPug0MTxmex8geQCVJjdwriJK3XEzTw2DH4ybqk_zmX1g7lCHEVRH0RKWVzkGQnP0_QBmKRBFd313275Lv0IKBM'

export async function askUserPermission() {
  try {
    return await Notification.requestPermission()
  } catch (err) {
    return false
  }
}

export async function createNotificationSubscription() {
  //wait for service worker installation to be ready
  try {
    const serviceWorker = await navigator.serviceWorker.ready
    // console.log(serviceWorker)
    // subscribe and return the subscription
    return await serviceWorker.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: pushServerPublicKey,
    })
  } catch (err) {
    return false
  }
}

export function getUserSubscription() {
  //wait for service worker installation to be ready, and then
  try {
    return navigator.serviceWorker.ready
      .then(function (serviceWorker) {
        return serviceWorker.pushManager.getSubscription()
      })
      .then(function (pushSubscription) {
        return pushSubscription
      })
  } catch (err) {
    return false
  }
}

export function isPushNotificationSupported() {
  try {
    return isClient() && 'serviceWorker' in navigator && 'PushManager' in window && Notification
  } catch (err) {
    return false
  }
}
