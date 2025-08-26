import React from 'react'
import NormalTag, { YuriTag } from '../tag/NormalTag'

export default function YuriTagList({ tags }) {
  return (
    <>
      {tags.map((item, index) => (
        <YuriTag key={`yuri-${index}`} id={item.url ? item.url : item.id}>
          {item.name}
        </YuriTag>
      ))}
    </>
  )
}
