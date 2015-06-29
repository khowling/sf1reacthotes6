
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
  <br/>
  <section className="site-grid--landing" >
    <ul className="grid wrap" >
      <NavElement navName="Core1" navClassIcon="standard-case" navIcon="standard-sprite/svg/symbols.svg#case"></NavElement>
      <NavElement navName="Core2"  navClassIcon="custom-57" navIcon="custom-sprite/svg/symbols.svg#custom57"></NavElement>
      <NavElement navName="Core3" navClassIcon="custom-19" navIcon="custom-sprite/svg/symbols.svg#custom19"></NavElement>
    </ul>
  </section>
</div>
    );
  }
}

export  class NavElement extends Component {


  render() {
    return (

      <li className="col--padded size--1-of-1 small-size--1-of-3 large-size--1-of-3">
        <a href="#">
        <figure >
          <SvgIcon svgClass={"icon icon-"+ this.props.navClassIcon +" icon__svg icon--large icon--circle"} useHref={"/assets/icons/"+this.props.navIcon}/>
          <figcaption >{this.props.navName}</figcaption>
          </figure>
        </a>
      </li>
    );
  }
}
