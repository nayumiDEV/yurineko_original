import useAuth from '@/hooks/useAuth'
import React, { useEffect, useRef } from 'react'
import postscribe from 'postscribe'

export const BidGearAds = () => {
  const auth = useAuth()

  const adRef = useRef(null)

  useEffect(() => {
    if (document.getElementById('ads_slot_bg')) {
      postscribe(
        adRef.current,
        '<script data-cfasync="false" type="text/javascript" src="//platform.bidgear.com/ads.php?domainid=6881&sizeid=28&zoneid=7631"></script>'
      )
    }
  }, [adRef])

  if (!auth?.token || (auth.role == 1 && !auth.isPremium)) {
    return (
      <div className="w-full" id='ads_slot_bg' ref={adRef}>
        <div id="bg_688127631"></div>
      </div>
    )
  }

  return null
}
