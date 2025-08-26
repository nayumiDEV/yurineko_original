import React, { Component } from 'react'

export default class ScrollToTop extends Component {
  constructor(props) {
    super(props)
    this.state = {
      is_visible: false,
      lastY: 0,
    }
    this.toggleVisibility = this.toggleVisibility.bind(this)
  }
  componentDidMount() {
    this.setState({
      lastY: window.pageYOffset,
    })
    document.addEventListener('scroll', this.toggleVisibility)
  }
  toggleVisibility() {
    if (window.pageYOffset < this.state.lastY && window.pageYOffset > 300) {
      this.setState({
        is_visible: true,
      })
      this.props.setParent && this.props.setParent(true)
    } else {
      this.setState({
        is_visible: false,
      })
      this.props.setParent && this.props.setParent(false)
    }
    this.setState({
      lastY: window.pageYOffset,
    })
  }
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }
  componentWillUnmount() {
    document.removeEventListener('scroll', this.toggleVisibility)
  }
  render() {
    const { is_visible } = this.state
    if (is_visible)
      return (
        <div
          onClick={this.scrollToTop}
          className="select-none cursor-pointer hover:opacity-80 z-top fixed bottom-4 right-4 w-12
        h-12 bg-transparent text-pink flex items-center justify-center rounded-full text-4xl"
        >
          <i className="fas fa-chevron-up"></i>
        </div>
      )
    return null
  }
}
