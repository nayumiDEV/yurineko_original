import { Divider, Switch } from 'antd'
import React, { useState } from 'react'
import { connect } from 'react-redux'
// import Darkmode from '../button/Darkmode'
import { AdminTag, PremiumTag } from '../tag/UserTag'
import { logout } from '../../redux/actions'
import useAuth from '@/hooks/useAuth'
import Link from 'next/link'
import UserBadge from '../list/UserBadge'
import Darkmode from '../toggle/Darkmode'
import ReactImageFallback from 'react-image-fallback'
import { daysRemaining, timeFromNow } from '@/utils/timeUpdate'
import Deposit from '../../components/form/Deposit'
import { useRouter } from 'next/router'
import Cookies from 'universal-cookie'

function Menu({ user, ...props }) {
  const defaultUser = useAuth()
  user = user ? user : defaultUser
  const [showAddMoney, setShowAddMoney] = useState(false)
  // const setShowAddMoneyModal = show
  const handleLogout = async () => {
    const cookies = new Cookies()
    await cookies.remove('user')
    props.logout()
  }
  const handleShowModal = () => setShowAddMoney(true)
  const route = useRouter()
  const path = route.asPath
  return (
    <>
      {user && (
        <div>
          <div className="flex items-center py-1">
            <div
              className="flex items-center justify-center overflow-hidden rounded-full mr-2 avatar flex-shrink-0"
              style={{ width: 60, height: 60 }}
            >
              <ReactImageFallback
                className="min-w-full min-h-full block flex-shrink-0"
                src={user.avatar}
                alt="logo"
                fallbackImage="/img/defaultAvatar.jpg"
              />
            </div>
            <div className="py-1">
              <p className="pr-1 mr-1 leading-none font-bold text-2xl dark:text-dark-text word-wrap clamp-2">
                {user.name}
              </p>
              <p className="leading-none font-semibold text-md text-gray-500 dark:text-dark-text">
                @{user.username}
              </p>
            </div>
          </div>

          <div>
            <div className="flex items-center">{<UserBadge user={user} />}</div>
            <div className="font-semibold text-base py-1 dark:text-dark-text">
              <i className="fas fa-coins"></i> {user.money} Yunecoin
              <button className="ml-2" onClick={handleShowModal}>
                <i className="fas fa-plus-circle text-green-500"></i>
              </button>
            </div>
          </div>
        </div>
      )}
      <Deposit visible={showAddMoney} setShowReportModal={setShowAddMoney} />
      <Divider className="my-2" />
      <div className="flex items-center justify-center">
        <span className="uppercase text-xl uppercase font-semibold mx-1 dark:text-dark-text">
          DARK MODE
        </span>
        <Darkmode user={user} />
      </div>
      <Divider className="my-2" />
      <ul className="dark:text-dark-text">
        {user && (
          <Link href="/me">
            <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i className="fas fa-user-circle"></i> <span>Hồ sơ</span>
            </li>
          </Link>
        )}
        {user && user.isPremium == true ? (
          <>
            <Link href="/premium">
              <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
                <i className="fas fa-gem"></i> <span>Premium</span>{' '}
                <span className="text-base text-gray">
                  còn {daysRemaining(user.premiumTime)} ngày
                </span>
              </li>
            </Link>
          </>
        ) : (
          <>
            <Link href="/premium">
              <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
                <i className="fas fa-gem"></i> <span>Premium</span>{' '}
              </li>
            </Link>
          </>
        )}
        {/* <Link href="/r18">
          <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
            <i className="fas fa-journal-whills"></i> <span>R18</span>{' '}
          </li>
        </Link> */}
        <Link href="/directory">
          <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
            <i className="fas fa-book"></i> <span>Danh mục</span>
          </li>
        </Link>
        {user && (
          <Link href="/list">
            <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i className="fas fa-bookmark"></i> <span>Yuri list</span>
            </li>
          </Link>
        )}
        {user && (
          <Link href="/favorite">
            <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i className="fas fa-crown"></i> <span>Yêu thích</span>
            </li>
          </Link>
        )}
        {user && (
          <Link href="/favorite-team">
            <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i className="fas fa-flag"></i> <span>Nhóm theo dõi</span>
            </li>
          </Link>
        )}

        <Link href="/history">
          <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
            <i className="fas fa-history"></i> <span>Lịch sử</span>
          </li>
        </Link>
        <Link href="/advanced">
          <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
            <i className="fas fa-search-plus"></i> <span>Tìm kiếm nâng cao</span>
          </li>
        </Link>
        {user && user.role == 1 && (
          <Link href="https://m.me/yurineko.moe">
            <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i className="fas fa-upload"></i> <span>Đăng ký upload</span>
            </li>
          </Link>
        )}
        {user && user.role == 2 && (
          <>
            <Divider className="my-2" />
            <Link href={`/team/${user.team.url || user.team.id}`}>
              <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i class="fas fa-pager"></i> <span>{user.team.name}</span>
              </li>
            </Link>
            <a target="_blank" href="https://admin.yurineko.moe" rel="noreferrer">
              <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
                <i className="fas fa-upload"></i> <span>Trình quản lý</span>
              </li>
            </a>
          </>
        )}
      </ul>
      <Divider className="my-2" />
      <ul className="dark:text-dark-text">
        <a target="_blank" href="https://www.facebook.com/yurineko.moe" rel="noreferrer">
          <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
            <i className="fab fa-facebook"></i> <span>Fanpage</span>
          </li>
        </a>
        <a target="_blank" href="https://discord.gg/QYPYqqMCaK" rel="noreferrer">
          <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
            <i className="fab fa-discord"></i> <span>Discord</span>
          </li>
        </a>
        {user ? (
          <li
            onClick={handleLogout}
            className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink"
          >
            <i className="fas fa-sign-out-alt"></i> <span>Đăng xuất</span>
          </li>
        ) : (
          <a href={`/account?url=${path}`}>
            <li className="text-xl font-semibold my-1 cursor-pointer hover:bg-gray-100 p-1 hover:text-pink">
              <i className="fas fa-sign-in-alt"></i> <span>Đăng nhập</span>
            </li>
          </a>
        )}
      </ul>
    </>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
})

const mapDispatchToProps = {
  logout,
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)
