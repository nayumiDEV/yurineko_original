import useAuth from '@/hooks/useAuth'
import React, { useEffect } from 'react'

export default function MoneTagVignetteAds() {
  const auth = useAuth()

  useEffect(() => {
    if (!auth?.token || (auth.role == 1 && !auth.isPremium)) {
      ;(function (d, z, s) {
        s.src = 'https://' + d + '/401/' + z
        try {
          ;(document.body || document.documentElement).appendChild(s)
        } catch (e) {}
      })('ossmightyenar.net', 6455471, document.createElement('script'))
    }
  }, [auth])

  return null
}
