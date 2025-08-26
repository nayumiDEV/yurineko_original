import React, { useEffect, useState } from 'react'

export default function ViewMode({ isGrid, handleChangeView }) {
  const [rendered, setRender] = useState(false)

  useEffect(() => {
    const defaultGridMode = localStorage.getItem('isGrid')
    if (defaultGridMode) {
      handleChangeView(JSON.parse(defaultGridMode))
    }
    setRender(true)
  }, [])

  if (!rendered) return null

  return (
    <div className="flex items-center">
      <button
        className={`${
          isGrid == false ? ' text-blue' : 'border-transparent text-gray'
        }  p-2 border-dotted flex mr-1 leading-none hover:text-blue hover:border-blue`}
        onClick={() => handleChangeView(false)}
      >
        <i className="fas fa-th-list text-xl leading-none"></i>
      </button>
      <button
        className={`${
          isGrid == true ? ' text-blue' : 'border-transparent text-gray'
        }  p-2 border-dotted flex mr-1 leading-none hover:text-blue hover:border-blue`}
        onClick={() => handleChangeView(true)}
      >
        <i className="fas fa-th text-xl leading-none"></i>
      </button>
    </div>
  )
}
