import useAuth from '@/hooks/useAuth'
import { useEffect, useRef } from 'react'
import { Helmet } from 'react-helmet'

export function ClickAduPops() {
  const auth = useAuth()

  if (!auth?.token || (auth.role == 1 && !auth.isPremium)) {
    return (
      <Helmet>
        <script type="text/javascript" src="/js/20241022.js" />
        <script
          data-cfasync="false"
          type="text/javascript"
          src="//appointeeivyspongy.com/aas/r45d/vki/1908365/deb8ef29.js"
          async
          onerror="vnsvfru()"
        />
      </Helmet>
    )
  }

  return null
}

export function ClickAduBanner({ id }) {
  const auth = useAuth()
  const adRef = useRef(null)

  useEffect(() => {
    if (adRef.current) {
      const child = document.createElement('script')
      child.type = 'text/javascript'
      child.src = `//chaseherbalpasty.com/lv/esnk/${id}/code.js`
      child.className = `__clb-${id}`
      adRef.current.appendChild(child)
    }
  }, [adRef])

  if (!auth?.token || (auth.role == 1 && !auth.isPremium)) {
    return <div ref={adRef} className="flex items-center justify-center" />
  }

  return null
}
