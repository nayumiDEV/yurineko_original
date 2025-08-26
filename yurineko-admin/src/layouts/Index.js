import React, { Children, Component } from 'react'
import { Helmet } from 'react-helmet'

export default class Layout extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>Yurineko2.0</title>
          <meta name="description" content="Upload Manager" />
        </Helmet>
        {this.props.children}
      </>
    )
  }
}
