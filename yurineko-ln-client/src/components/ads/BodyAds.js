import React from 'react'
import useAuth from '@/hooks/useAuth'

export default function BodyAds() {
  const auth = useAuth()

  // if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))
  //   return (
  //     <div
  //       dangerouslySetInnerHTML={{
  //         __html: `<script type="application/javascript" data-idzone="4245622"  data-ad_frequency_count="1"  data-ad_frequency_period="15"  data-type="desktop" data-browser_settings="1" data-ad_trigger_method="3" src="https://a.exdynsrv.com/fp-interstitial.js"></script>`,
  //       }}
  //     />
  //   )
  return null
}
