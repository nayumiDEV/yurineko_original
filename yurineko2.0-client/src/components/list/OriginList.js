import React from 'react'
import Link from 'next/link'
import { originLink } from '@/utils/generateLink'

export default function OriginList({ origin, color }) {
  return (
    <>
      {origin.map((item, index) => (
        // id={item.url ? item.url : item.id}
        <a href={originLink(item.url ? item.url : item.id)} key={`origin-${index}`}>
          <p className="  dark:text-dark-text hover:text-pink cursor-pointer manga-list-box__name manga-list-box__name--original">
            {item.name} Doujin
            {index != origin.length - 1 ? ', ' : ''}
          </p>
        </a>
      ))}
    </>
  )
}
