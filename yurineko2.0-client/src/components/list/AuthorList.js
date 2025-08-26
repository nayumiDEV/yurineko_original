import React from 'react'
import { AuthorName } from '../tag/Text'
import Link from 'next/link'

export default function AuthorList({ author, color }) {
  return (
    <>
      {author.map((item, index) => (
        <AuthorName key={`author-${index}`} color={color} id={item.url ? item.url : item.id}>
          {item.name}
          {index != author.length - 1 ? ', ' : ''}
        </AuthorName>
      ))}
    </>
  )
}
