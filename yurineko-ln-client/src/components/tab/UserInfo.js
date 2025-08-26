import { Modal } from 'antd'
import React, { useState } from 'react'
import ReactImageFallback from 'react-image-fallback'
import { connect } from 'react-redux'
import UserBadge from '../list/UserBadge'
import { AdminTag, PremiumTag, UploadTag } from '../tag/UserTag'
import Link from 'next/link'
import { teamLink } from '@/utils/generateLink'
import { getDate } from '@/utils/timeUpdate'
import FormEditUser from '../form/FormEditUser'
import parseGender from '@/utils/parseGender'

function UserInfo({ user, ...props }) {
  const [isVisibleModal, setIsVisibleModal] = useState(false)
  const hanldeOpenModal = () => {
    setIsVisibleModal(true)
  }
  const handleCloseModal = () => {
    setIsVisibleModal(false)
  }
  return (
    <div className="dark:text-dark-text">
      <div className="">
        <div className="flex items-center justify-center rounded-md max-h-52 overflow-hidden">
          <ReactImageFallback
            className="max-w-full max-h-full flex-shrink-0"
            src={user.cover}
            alt="cover"
            fallbackImage={process.env.BANNER_PROFILE}
          />
        </div>
        <div className="flex pl-8 transform -translate-y-8 ">
          <div
            className="flex-shrink-0 flex-grow-0 ring-4 ring-white flex items-center justify-center overflow-hidden rounded-full cursor-pointer"
            style={{ width: 70, height: 70 }}
          >
            <ReactImageFallback
              className="min-w-full min-h-full block flex-shrink-0"
              src={user.avatar}
              alt="logo"
              fallbackImage="/img/defaultAvatar.jpg"
            />
          </div>
          <div className="ml-4 flex items-end flex-wrap transform">
            {<UserBadge user={user} />}
            <button className="mr-4" onClick={hanldeOpenModal}>
              <span className="p-2 mr-2 inline-block leading-none font-semibold rounded-full border border-pink text-pink hover:bg-pink hover:text-white">
                C.Sửa hồ sơ
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="transform -translate-y-8 p-2">
        <p className="text-2xl font-bold ">
          {user.name}
          {/* <span className="font-normal">(Yune)</span> */}
        </p>
        {user.team && user.team.id != 1 && (
          <Link href={teamLink(user.team.url ? user.team.url : user.team.id)}>
            <p className="max-w-xs font-semibold text-md cursor-pointer">
              <i className="fas fa-flag mr-2"></i>{' '}
              <span className="text-tag-team">{user.team.name}</span>
            </p>
          </Link>
        )}
        <p className="text-md font-normal max-w-md">{user.shortBio ?? ''}</p>
        <p className="text-seimbold">
          <i className="fas fa-birthday-cake mr-2"></i>{' '}
          <span>{user.dob ? getDate(user.dob) : 'Đang cập nhật'}</span>
        </p>
        <p className="text-seimbold">
          <i className="fas fa-map-marker-alt mr-2"></i>{' '}
          <span>{user.place_of_birth ?? 'Đang cập nhật'}</span>
        </p>
        <p className="text-seimbold">
          <i className="fas fa-calendar-week mr-2"></i>{' '}
          <span>Tham gia vào {getDate(user.createAt)}</span>
        </p>
      </div>
      <div className="p-2 border-t border-gray-300 transform -translate-y-8">
        <p className="text-seimbold">
          <span className="font-bold">Giới tính:</span>{' '}
          <span>{parseGender(user.gender) ?? 'Đang cập nhật'}</span>
        </p>
        <p className="text-seimbold">
          <span className="font-bold">Sở thích:</span> <span>{user.love ?? 'Đang cập nhât'}</span>
        </p>
        <div>
          <p className="text-seimbold">
            <span className="font-bold">Giới thiệu:</span>
          </p>
          <p className="font-normal">{user.bio ?? ''}</p>
        </div>
        {/* <p className="text-seimbold">
          <span className="font-bold">Facebook:</span> <span>Nam</span>
        </p>
        <p className="text-seimbold">
          <span className="font-bold">Twitter:</span> <span>Nam</span>
        </p> */}
      </div>
      <Modal
        wrapClassName="edit-profile-modal"
        visible={isVisibleModal}
        footer={false}
        closable={false}
        // onCancel={handleCloseModal}
      >
        <FormEditUser handleCloseModal={handleCloseModal} />
      </Modal>
    </div>
  )
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
