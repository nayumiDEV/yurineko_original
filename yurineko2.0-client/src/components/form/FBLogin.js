import React from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'

export default function FBLogin({ responseFacebook }) {
  return (
    <FacebookLogin
      appId={process.env.FB_APP}
      autoLoad={false}
      reauthenticate={true}
      isMobile={false}
      // redirectUri="https://yurineko.moe/account"
      fields="name,email,picture"
      callback={responseFacebook}
      render={(renderProps) => (
        <button
          htmlType="button"
          onClick={(e) => {
            e.preventDefault()
            renderProps.onClick()
          }}
          className="mt-4 bg-blue w-full block p-2 uppercase text-xl font-semibold text-white rounded flex items-center justify-center"
        >
          Đăng nhập bằng Facebook
        </button>
      )}
    />
  )
}
