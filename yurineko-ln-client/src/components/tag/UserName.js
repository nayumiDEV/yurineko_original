import React from 'react'

export function MentionName(name) {
  return <span className="text-md font-blue-400">@{name}</span>
}

export function UserName(name) {
  return <span className="text-md text-blue font-semibold">{name}</span>
}

export function TeamName(name) {
  return <span className="text-base text-blue">@{name}</span>
}

export function CommentName(name){
    <p className="text-pink text-md font-semibold leading-tight">{name}</p>
}

