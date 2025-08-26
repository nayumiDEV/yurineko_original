import useAuth from '@/hooks/useAuth'
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'

export default function GoogleAd() {
  const auth = useAuth()
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ; (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) { }
  }, [])

  return (
    <Helmet>
      {!auth || !auth.token || (auth.role == 1 && !auth.isPremium) ? (
        <script
          data-ad-client="ca-pub-1067237176672732"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
        ></script>
      ) : (
        ''
      )}
    </Helmet>
  )
}

export function GGHomePageSpanAds() {
  const auth = useAuth()
  if (!auth || !auth.token || (auth.role == 1 && !auth.isPremium)) {
    return (
      <div className="mx-auto items-center justify-center">
        <ins class="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1067237176672732"
          data-ad-slot="4215436476"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    )
  }
  return null
}

export function GGReadSpanTopAds() {
  const auth = useAuth()
  if (!auth || !auth.token || (auth.role == 1 && !auth.isPremium)) {
    return (
      <div className="mx-auto items-center justify-center">
        <ins class="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1067237176672732"
          data-ad-slot="4079705101"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    )
  }
  return null
}

export function GGReadSpanBottomAds() {
  const auth = useAuth()
  if (!auth || !auth.token || (auth.role == 1 && !auth.isPremium)) {
    return (
      <div className="mx-auto items-center justify-center">
        <ins class="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-1067237176672732"
          data-ad-slot="5982979569"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    )
  }
  return null
}
