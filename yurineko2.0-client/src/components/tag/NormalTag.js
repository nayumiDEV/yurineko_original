import React from 'react'
import Link from 'next/link'
import { coupleLink, tagLink } from '@/utils/generateLink'

export default function NormalTag({ children, id }) {
  return (
    <a href={tagLink(id)}>
      <span
        style={{ borderRadius: '3px', padding: '0.25rem 0.5rem' }}
        className="font-semibold cursor-pointer select-none block mr-2 my-1 bg-tag dark:bg-tag-dark dark:text-white text-white leading-none hover:text-tag-hover inline-block whitespace-no-wrap"
      >
        {children}
      </span>
    </a>
  )
}

export function YuriTag({ children, id }) {
  return (
    <a href={coupleLink(id)} shallow={true}>
      <span
        style={{ borderRadius: '3px', padding: '0.25rem 0.5rem' }}
        className="font-semibold cursor-pointer select-none block mr-2 my-1 bg-tag-yuri dark:bg-tag-yuri-dark text-white py-1 px-1 leading-none  hover:text-pink-dark inline-block whitespace-no-wrap"
      >
        {children}
      </span>
    </a>
  )
}
