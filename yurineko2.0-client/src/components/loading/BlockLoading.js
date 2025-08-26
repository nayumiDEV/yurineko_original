import React, { useEffect } from 'react'
import { connect } from 'react-redux'

function BlockLoading({ isLoading }) {
 
  if (isLoading)
    return (
      <div className="w-full h-full bg-white dark:bg-dark bg-opacity flex items-center justify-center overflow-hidden min-h-xl">
        <div className="w-48 h-48 flex items-center justify-center overflow-hidden">
          <img src="/img/cat-loading.svg" className="flex-shrink-0 max-w-full max-h-full" />
        </div>
      </div>
    )
  else return null
}

export default BlockLoading
