import React, { useEffect } from 'react'
import { connect } from 'react-redux'

function PageLoading({ isLoading }) {
  useEffect(() => {
    if (isLoading == true) {
      document.querySelector('body').classList.add('disable-scroll')
    } else {
      document.querySelector('body').classList.remove('disable-scroll')
    }
    return () => {
      document.querySelector('body').classList.remove('disable-scroll')
    }
  }, [isLoading])
  if (isLoading)
    return (
      <div className="w-full h-full bg-gray-100 bg-opacity flex items-center justify-center overflow-hidden fixed top-0 left-0 z-top1">
        <div className="w-48 h-48 flex items-center justify-center overflow-hidden">
          <img src="/img/cat-loading.svg" className="flex-shrink-0 max-w-full max-h-full" />
        </div>
      </div>
    )
  else return null
}

const mapStateToProps = (state) => ({
  isLoading: state.general.isLoading,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, null)(PageLoading)

