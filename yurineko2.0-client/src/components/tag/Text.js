import React from 'react'
import Link from 'next/link'
import { authorLink, teamLink, userLink } from '@/utils/generateLink'
import UserBadge from '../list/UserBadge'
import { AdminTag, PremiumTag, UploadTag } from './UserTag'
import { connect } from 'react-redux'

export function ItalicTag(text) {
  return <span className="text-gray-500 italic">{text}</span>
}

export function AuthorName({ children, color, id }) {
  return (
    <a href={authorLink(id)}>
      <span
        style={{ color: color, fontSize: '1.1rem' }}
        className={`text-gray-dark dark:text-dark-text cursor-pointer hover:text-pink w-max`}
      >
        {children}
      </span>
    </a>
  )
}

export function TeamName({ team, color }) {
  return (
    <>
      {team.map((item) => {
        return (
          <a key={team.id} href={teamLink(item.url ? item.url : item.id)}>
            <span
              style={{ color: color, fontSize: '1.1rem' }}
              className={`text-gray-dark dark:text-dark-text text-md cursor-pointer hover:text-pink w-max`}
            >
              {item?.name ?? 'Đang cập nhật'}
            </span>
          </a>
        )
      })}
    </>
  )
}

export function Description({ text, color, clamp }) {
  return (
    <p
      style={{ color: color, fontSize: '1.1rem' }}
      className={`font-normal ${clamp}`}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  )
}

export function RoleName({ text, role, teamName, teamID, username, userID, premium, isBanned }) {
  return (
    <>
      <div
        className={`${
          premium == true && role != 2
            ? 'text-tag-premium'
            : role == 1
            ? 'text-tag-user'
            : role == 2
            ? 'text-tag-uploader'
            : role == 3
            ? 'text-tag-admin'
            : 'text-pink'
        } text-base font-bold leading-tight flex items-end`}
      >
        <Link href={userLink(username ? username : userID)}>
          <span className={`mr-2 ${isBanned ? 'line-through text-ban' : ''}`}>{text}</span>
        </Link>
        {role === 3 && <AdminTag />}
        {role === 2 && <UploadTag />}
        {premium == true && role != 3 && <PremiumTag />}
        {isBanned == true && <p className="text-xs font-bold text-red-500 ml-1">banned</p>}
      </div>
      <p>
        {role === 2 && (
          <Link href={teamLink(teamID)}>
            <span className="text-tag-team font-normal">
              {' '}
              <i className="fas fa-flag text-gray-400 text-normal"></i> {teamName}
            </span>
          </Link>
        )}
      </p>
    </>
  )
}
