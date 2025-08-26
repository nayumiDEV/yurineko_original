import React from 'react'
import useAuth from '@/hooks/useAuth'

export default function RowAds({ top = true }) {
  const auth = useAuth()

  if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))
    return (
      <div className="flex items-center justify-center">
        {/* {top ? (
          <iframe
            src="//a.exdynsrv.com/iframe.php?idzone=4245606&size=728x90"
            width="728"
            height="90"
            scrolling="no"
            marginwidth="0"
            marginheight="0"
            frameborder="0"
          ></iframe>
        ) : (
          <iframe
            src="//a.exdynsrv.com/iframe.php?idzone=4245612&size=728x90"
            width="728"
            height="90"
            scrolling="no"
            marginwidth="0"
            marginheight="0"
            frameborder="0"
          ></iframe>
        )} */}
      </div>
    )
  else return null
}
