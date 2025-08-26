import useAuth from '@/hooks/useAuth'
import React, { Component, useEffect } from 'react'
import { Helmet } from 'react-helmet'

export default function GoogleAd() {
  const auth = useAuth()
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {}
  }, [])

  return (
    <Helmet>
      {!auth || !auth.token || (auth.role == 1 && auth.isPremium == false) ? (
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
