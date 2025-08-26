import React from 'react'
import useAuth from '@/hooks/useAuth'
import { Helmet } from 'react-helmet'

export default function RowAds({ top = true }) {
  const auth = useAuth()

  if (!auth || !auth.token || (auth.role == 1 && auth.isPremium == false))

    return (
      <Helmet>
        <div className="flex items-center justify-center">
          {top ? (
            <script async data-cfasync="false" type="text/javascript" src="https://berlipurplin.com/lv/esnk/1874637/code.js" strategy="lazyOnload" id="__clb-1874637" />
          ) : (
            <script async data-cfasync="false" type="text/javascript" src="https://berlipurplin.com/lv/esnk/1874639/code.js" strategy="lazyOnload" id="__clb-1874639" />
          )}
        </div>
      </Helmet>
    )
  else return null
}
