import React from 'react'
import useAuth from '@/hooks/useAuth'

export default function ColAds({ left = false }) {
  const auth = useAuth()

  if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))
    return (
      <>
        {/* {left ? (
          <div className="absolute top-20 left-0 hidden xl:block">
            <iframe
              src="//a.exdynsrv.com/iframe.php?idzone=4245614&size=160x600"
              width="160"
              height="600"
              scrolling="no"
              marginwidth="0"
              marginheight="0"
              frameborder="0"
            ></iframe>
          </div>
        ) : (
          <div className="absolute top-20 right-0 hidden xl:block">
            <iframe
              src="//a.exdynsrv.com/iframe.php?idzone=4245616&size=160x600"
              width="160"
              height="600"
              scrolling="no"
              marginwidth="0"
              marginheight="0"
              frameborder="0"
            ></iframe>
          </div>
        )} */}
      </>
    )
  return null
}
