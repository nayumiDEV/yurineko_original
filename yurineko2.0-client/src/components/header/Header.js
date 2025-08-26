import { Dropdown } from 'antd'
import React, { useEffect } from 'react'
import LiveSearch from '../form/LiveSearch'
import LiveSearchMobile from '../form/LiveSearchMobile'
import DropDownMenu from '../menu/DropDownMenu'
import Notify from '../menu/Notify'
import Link from 'next/link'
import useAuth from '@/hooks/useAuth'
import { useTheme } from 'next-themes'
import isEnableDarkmode from '@/utils/isEnableDarkmode'
import ReactImageFallback from 'react-image-fallback'
import { connect } from 'react-redux'
import { getProfile, getNotification, seenNotification } from '../../redux/actions'
import { useRouter } from 'next/router'

function Header({ user, showDrawer, unSeen, ...props }) {
  const auth = useAuth()

  const { theme, setTheme } = useTheme()
  useEffect(() => {
    if (!isEnableDarkmode(user) && theme == 'dark') setTheme('light')

    if (auth && auth.token) {
      props.getProfile()
      props.getNotification()
    }
  }, [])

  const handleSeenNotification = () => {
    if (unSeen != 0) {
      props.seenNotification()
    }
  }

  const route = useRouter()
  const path = route.asPath

  return (
    // <Affix offsetTop={0}>
    <header className="bg-pink dark:bg-dark-black dark:text-dark-white">
      <div className="container mx-auto xl:px-40">
        <div className="flex items-center justify-between p-2 text-white">
          <div className="w-20 md:hidden ml-2">
            <button onClick={showDrawer}>
              <i className="fas fa-bars text-2xl" />
            </button>
          </div>
          <div className="w-16 hidden md:block flex justify-center items-center">
            <Link href="/" shallow={true}>
              <a className="block w-full">
                <img src={'/img/logo.png'} alt="logo" className="block w-100" />
              </a>
            </Link>
          </div>
          <div className="w-auto flex justify-center items-center md:hidden">
            <Link href="/">
              <a className="block w-10">
                <img src={'/img/logo.png'} alt="logo" className="block w-100" />
              </a>
            </Link>
          </div>
          <div className="w-max justify-between items-center hidden md:flex mr-auto">
            <Link href="/r18">
              <a className="md:text-md xl:text-2xl font-semibold text-white hover:text-white block mx-4">
                R18
              </a>
            </Link>
            <Link href="/directory">
              <a className="md:text-md xl:text-2xl font-semibold text-white hover:text-white block mx-4">
                Danh mục
              </a>
            </Link>
            <Link href="/list">
              <a className="md:text-md xl:text-2xl font-semibold text-white hover:text-white block mx-4">
                Yuri List
              </a>
            </Link>
          </div>
          <LiveSearch />
          <div className="flex items-center w-20 bg-red justify-center md:hidden">
            <Dropdown className="mr-2" overlay={<Notify />} trigger={['click']}>
              <button onClick={handleSeenNotification} className="relative">
                <i className="far fa-bell text-3xl" />
                {unSeen != 0 && (
                  <div
                    className="absolute bg-red-500 text-white flex items-center justify-center rounded-full leading-none font-semibold"
                    style={{
                      fontSize: 11,
                      border: '1.9px solid white',
                      padding: 2,
                      top: 0,
                      right: -5,
                      width: 17,
                      height: 17,
                    }}
                  >
                    {unSeen}
                  </div>
                )}
              </button>
            </Dropdown>
            <LiveSearchMobile />
          </div>
          <div className="flex w-24 items-center justify-between hidden md:flex">
            {user ? (
              <>
                <Dropdown className="ml-2" overlay={<Notify />} trigger={['click']} placement="bottomRight">
                  <button onClick={handleSeenNotification} className="relative">
                    <i className="far fa-bell text-3xl" />
                    {unSeen != 0 && (
                      <div
                        className="absolute bg-red-500 text-white flex items-center justify-center rounded-full leading-none font-semibold"
                        style={{
                          fontSize: 11,
                          border: '1.9px solid white',
                          padding: 2,
                          top: 0,
                          right: -5,
                          width: 17,
                          height: 17,
                        }}
                      >
                        {unSeen}
                      </div>
                    )}
                  </button>
                </Dropdown>
                <Dropdown overlay={DropDownMenu} trigger={['click']} className="cursor-pointer">
                  <div
                    className="ring ring-white flex items-center justify-center overflow-hidden rounded-full cursor-pointer"
                    style={{ width: 40, height: 40 }}
                  >
                    <ReactImageFallback
                      className="min-w-full min-h-full block flex-shrink-0"
                      src={user.avatar}
                      alt="logo"
                      fallbackImage="/img/defaultAvatar.jpg"
                    />
                  </div>
                </Dropdown>
              </>
            ) : (
              <a
               href={`/account?url=${path}`}
              >
                <button className="relative">
                  <i className="fas fa-sign-in-alt text-3xl"></i>
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
    // </Affix>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  unSeen: state.user.notification.unSeen,
})

const mapDispatchToProps = {
  getProfile,
  getNotification,
  seenNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)
