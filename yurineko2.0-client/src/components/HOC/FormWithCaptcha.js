import { Form } from 'antd'
import React, { useState } from 'react'
import ReCAPTCHA from 'react-google-recaptcha'

export default class FormWithCaptcha extends React.Component {
  constructor(props) {
    super(props)
    // const { onSubmitCapture, children, submit, cancel } = this.props
    this.state = {
      captcha: '',
      isError: false,
    }
  }

  submit = (e) => {
    if (this.state.captcha) {
      this.props.onSubmitCapture(e)
    } else
      this.setState({
        isError: true,
      })
  }
  handleCapcha = (e) => {
    localStorage.setItem('g-recaptcha-response', e)
    this.setState({
      captcha: e,
    })
  }
  render() {
    return (
      <Form onSubmitCapture={this.submit}>
        {this.props.children}
        <div className={`w-min my-4`}>
          {this.state.isError && (
            <p className="font-semibold text-red-500 text-xs">Bạn chưa nhập captcha</p>
          )}
          <div className={`${this.state.isError ? 'border-red-500 border' : ''}`}>
            <ReCAPTCHA sitekey={process.env.CAPCHA_KEY} onChange={this.handleCapcha} />
          </div>
        </div>
        {this.props.action}
      </Form>
    )
  }
}
