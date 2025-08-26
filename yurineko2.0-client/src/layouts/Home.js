import React, { useState } from 'react'
import Footer from '@/components/footer/Footer'
import SlideBar from '@/components/drawer/SlideBar'
import Header from '@/components/header/Header'
import BodyAds from '@/components/ads/BodyAds'
import ColAds from '@/components/ads/ColAds'
import { ClickAduPops } from '@/components/ads/ClickAdu'
import MoneTagVignetteAds from '@/components/ads/Monetag'

export default function LayoutHome({ children }) {
  const [visible, setVisible] = useState(false)
  const showDrawer = () => {
    setVisible(true)
  }

  const onClose = () => {
    setVisible(false)
  }
  // useEffect(() => {
  //   console.log('disable menu')
  //   document.addEventListener('contextmenu', (e) => {
  //     e.preventDefault()
  //   })
  // }, [])
  return (
    <div className="wrapper min-h-screen bg-white dark:bg-dark">
      <ClickAduPops />
      <MoneTagVignetteAds />
      {/* <GalaFloatingButtonAds/> */}
      {/* check man hinh di dong moi render */}
      <SlideBar visible={visible} onClose={onClose} />
      {/* header */}
      <Header showDrawer={showDrawer} />
      <div className="relative">
        <ColAds left />
        <ColAds left={false} />
        {children}
      </div>
      <BodyAds />
      <Footer />
      {/* <PropellerAds /> */}
    </div>
  )
}
