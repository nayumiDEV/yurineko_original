import { useState, useEffect } from 'react'
import axios from 'axios'
import * as serviceWorker from './serviceWorker'
import {
  isPushNotificationSupported,
  askUserPermission,
  createNotificationSubscription,
  getUserSubscription,
} from './serviceWorker'
import isClient from '@/utils/isClient'

// const pushNotificationSupported = isClient() ? false : isPushNotificationSupported()
// check push notifications are supported by the browser

export default function usePushNotifications() {
  const [userConsent, setSuserConsent] = useState('')

  const [userSubscription, setUserSubscription] = useState(null)
  const [pushServerSubscriptionId, setPushServerSubscriptionId] = useState()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if ('Notification' in window) {
      setSuserConsent(Notification ? Notification.permission : 'NotSupport')
    }
  }, [])

  useEffect(() => {
    if ('Notification' in window) {
      setLoading(true)
      setError(false)
    }
  }, [])

  const getExixtingSubscription = async () => {
    const existingSubscription = await getUserSubscription()
    setUserSubscription(existingSubscription)
    setLoading(false)
    return existingSubscription
  }

  useEffect(() => {
    setLoading(true)
    setError(false)
    getExixtingSubscription()
  }, [])

  const onClickAskUserPermission = () => {
    setLoading(true)
    setError(false)
    askUserPermission().then((consent) => {
      setSuserConsent(consent)
      if (consent !== 'granted') {
        setError({
          name: 'Consent denied',
          message: 'You denied the consent to receive notifications',
          code: 0,
        })
      }
      setLoading(false)
    })
  }
  //

  const onClickSusbribeToPushNotification = async () => {
    setLoading(true)
    setError(false)

    return createNotificationSubscription()
      .then(function (subscrition) {
        setUserSubscription(subscrition)
        setLoading(false)
        return subscrition
      })
      .catch((err) => {
        console.error(
          "Couldn't create the notification subscription",
          err,
          'name:',
          err.name,
          'message:',
          err.message,
          'code:',
          err.code
        )
        setError(err)
        setLoading(false)
      })
  }

  return {
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    pushServerSubscriptionId,
    userConsent,
    userSubscription,
    error,
    loading,
    getExixtingSubscription,
  }
}
