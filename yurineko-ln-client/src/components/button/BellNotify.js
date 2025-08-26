import React from 'react'
import { connect } from 'react-redux'

function BellNotify({ unSeen }) {
  return (
    <button className="relative">
      <i className="far fa-bell text-3xl" />
      {unSeen != 0 && (
        <div
          className="absolute bg-red-500 text-white flex items-center justify-center rounded-full leading-none font-semibold"
          style={{
            fontSize: 11,
            border: '1.9px solid white',
            padding: 2,
            top: 0,
            right: -5,
          }}
        >
          {unSeen}
        </div>
      )}
    </button>
  )
}

const mapStateToProps = (state) => ({
  unSeen: state.user.notifcation.unSeen,
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(BellNotify)
