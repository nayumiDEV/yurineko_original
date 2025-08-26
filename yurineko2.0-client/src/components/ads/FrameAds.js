import React from 'react'
import useAuth from '@/hooks/useAuth'

export default function FrameAds() {
  const auth = useAuth()

  if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))
    return (
      <div
        dangerouslySetInnerHTML={{
          __html: `<iframe
            data-aa="1610502"
            src="//acceptable.a-ads.com/1610502"
            scrolling="no"
            style="border:0px; padding:0; width:100%; height:100%; overflow:hidden"
            allowtransparency="true"
          ></iframe>`,
        }}
      />
    )
  return null
}
