import React, { Children, Component } from 'react'
import { Helmet } from 'react-helmet'

export default class Upload extends Component {
  render() {
    return (
      <>
        <Helmet>
          <title>Team Manager</title>
          <meta name="description" content="Upload Manager" />
        </Helmet>
        {this.props.children}
      </>
    )
  }
}
