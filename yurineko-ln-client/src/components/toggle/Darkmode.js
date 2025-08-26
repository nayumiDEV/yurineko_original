import { Switch } from 'antd'
import React, { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import useAuth from '@/hooks/useAuth'
import isEnableDarkmode from '@/utils/isEnableDarkmode'

export default function Darkmode({ user }) {
  const { theme, setTheme } = useTheme()
  // const user = useAuth()

  useEffect(() => {
    // if (!isEnableDarkmode(user) && theme == 'dark') setTheme('light')
    if (!isEnableDarkmode(user) && theme == 'dark') setTheme('light')
  }, [])

  const handleToggle = (value) => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }
  const [mounted, setMounted] = useState(false)

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null
  return (
    <div className="relative">
      <Switch
        disabled={!isEnableDarkmode(user)}
        className="mx-1 dark-switch"
        onChange={handleToggle}
        defaultChecked={theme == 'dark' ? true : false}
      />
      {!isEnableDarkmode(user) && (
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center ">
          <i className="fas fa-lock text-gray-500"></i>
        </div>
      )}
    </div>
  )
}
