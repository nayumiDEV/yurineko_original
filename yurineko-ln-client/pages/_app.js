import 'antd/dist/antd.css'
import '../styles/globals.scss'
import '../styles/editorjs.scss'
import '../styles/globals.css'
import '../styles/utilities.css'
import 'react-quill/dist/quill.snow.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'emoji-mart/css/emoji-mart.css'
import '../styles/heart.scss'
import { ThemeProvider } from 'next-themes'

import { Provider } from 'react-redux'
import { CookiesProvider } from 'react-cookie'
import store from 'src/redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { useEffect } from 'react'
import usePushNotifications from '@/hooks/usePushNotifications'
import { addPush } from 'api/general'
import useAuth from '@/hooks/useAuth'
import { Helmet } from 'react-helmet'
import GoogleAd from '@/components/ads/GGAds'
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  const { onClickSusbribeToPushNotification, getExixtingSubscription } = usePushNotifications()
  const auth = useAuth()

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('/sw.js').then(
          function (registration) {
            console.log('Service Worker registration success:')
          },
          function (err) {
            console.log('Service Worker registration failed: ', err)
          }
        )
      })
    }
  }, [])

  useEffect(async () => {
    if ('Notification' in window && auth && auth.token) {
      console.log('Has Notification in window')
      const defaultSub = await getExixtingSubscription()
      console.log('Has default subscribe')

      if (!defaultSub) {
        console.log('Dont have default subscribe')

        const userSub = await onClickSusbribeToPushNotification()
        console.log('Request success')
        if (userSub) {
          addPush(userSub)
        }
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>Yurineko Novel \ Ánh dương sau đêm đen</title>
      </Head>
      <CookiesProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={store.__PERSISTOR}>
            <ThemeProvider attribute="class">
              <Component {...pageProps} />
            </ThemeProvider>
          </PersistGate>
        </Provider>
      </CookiesProvider>
    </>
  )
}

export default MyApp
