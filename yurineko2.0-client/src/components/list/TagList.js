import React from 'react'
import NormalTag, { YuriTag } from '../tag/NormalTag'

export default function TagList({ tags }) {
  return (
    <>
      {tags.map((item, index) => (
        <NormalTag key={`tag-${index}`} id={item.url ? item.url : item.id}>
          {item.name}
        </NormalTag>
      ))}
    </>
  )
}
