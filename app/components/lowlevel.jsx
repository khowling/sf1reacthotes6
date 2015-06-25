'use strict';

import React, {Component} from 'react';


export  class SvgIcon extends Component {
  render() {
    return (
      <svg className={this.props.svgClass}
        dangerouslySetInnerHTML={{__html: "<use xlink:href='"+this.props.useHref+"' />"}}>
      </svg>
  )}
}
