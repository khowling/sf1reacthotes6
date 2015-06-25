
'use strict';

import React, {Component} from 'react';
import {SvgIcon} from './lowlevel.jsx';


export default class MenuNav extends Component {


  render() {
    return (

<div className="site-content container" >
  <div className="container--medium container--center text-longform">

    <p className="text-introduction" >
      <span >At the heart of the Salesforce Design System is a so includes a broad icon set. You can also achieve customization through our Design Tokens.</span>
    </p>
  </div>
  <section className="site-grid--landing" >
    <ul className="grid wrap" >
      <NavElement navName="Core1"></NavElement>
      <NavElement navName="Core2"></NavElement>
      <NavElement navName="Core3"></NavElement>
    </ul>
  </section>
</div>
    );
  }
}

export  class NavElement extends Component {


  render() {
    return (

      <li className="col--padded size--1-of-1 small-size--1-of-2 large-size--1-of-5">
        <a href="#">
        <figure >
          <SvgIcon svgClass="icon icon-custom-57 icon__svg icon--large icon--circle" useHref="/assets/icons/custom-sprite/svg/symbols.svg#custom57"/>
          <figcaption >{this.props.navName}</figcaption>
          </figure>
        </a>
      </li>
    );
  }
}
