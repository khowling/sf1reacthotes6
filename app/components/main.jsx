'use strict';

import React, {Component} from 'react';
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';

import {MenuNav, NavElement} from './menunav.jsx';
import {SvgIcon} from './lowlevel.jsx';
import {SearchDialog, TabHeading} from './search.jsx';
import TimeLine from './timeline.jsx';

class MainHeader extends Component {
  render() {
    return (
      <header className="site-masthead--landing theme--brand text-longform container">
        <h1 className="text-heading--large" >Salesforce Design&nbsp;System</h1>
        <h2 className="text-heading--medium" >Build excellent, beautiful applications designed for&nbsp;scale.</h2>
        <p className="m-top--x-large" >
          <a href="/tutorials/" className="button button--neutral" >Read Tutorials</a>
          <span> </span>
          <a href="/downloads/" className="button button--neutral button-space-left" >Get Design System</a>
        </p>
      </header>
    )
  }
}
export default class Main extends Component {

  clickNav() {
    Velocity.animate(
      React.findDOMNode(this.refs.navbutton),
      {rotateZ: "45deg"});
    Velocity.animate(
        React.findDOMNode(this.refs.navactions),
        "transition.slideUpIn",
        {stagger: 200});
  }

  componentDidMount() {

    Velocity.animate(
      React.findDOMNode(this.refs.navbutton),
      "transition.whirlIn",
      { delay: 1000 });

  }

  render() {
    return (
<div>

  <MainHeader/>
  <a ref="navbutton" style={{display: "none", position: "fixed",  bottom: "30px",  right: "5%", zIndex: "3"}} onClick={this.clickNav.bind(this)}>
    <span style={{padding: "0.5rem"}}>
      <SvgIcon svgClass="icon icon__svg icon-action-dial-in nav_icon" useHref="/assets/icons/action-sprite/svg/symbols.svg#dial_in"/>
    </span>
  </a>

  <div ref="navactions" className="theme--brand" style={{display: "none", position: "fixed",  bottom: "0px",  left: "0", right: "0", zIndex: "2"}}>

      <ul className="action__icons grid wrap icon-grid" >
        <li className="col--padded m-bottom--x-large" style={{marginBottom: ".5rem", marginTop: ".5rem"}}>
          <figure >
            <span className="icon__container icon-action-announcement" >
              <SvgIcon svgClass="icon icon__svg  icon-action-announcement" useHref="/assets/icons/action-sprite/svg/symbols.svg#announcement"/>
            </span>
            <figcaption className="p-top--x-small text-body--small">announcement</figcaption>
          </figure>
        </li>
        <li className="col--padded m-bottom--x-large" style={{marginBottom: ".5rem", marginTop: ".5rem"}}>
          <figure >
            <span className="icon__container icon-action-announcement" >
              <SvgIcon svgClass="icon icon__svg  icon-action-announcement" useHref="/assets/icons/action-sprite/svg/symbols.svg#announcement"/>
            </span>
            <figcaption className="p-top--x-small text-body--small">announcement</figcaption>
          </figure>
        </li>
        <li className="col--padded m-bottom--x-large" style={{marginBottom: ".5rem", marginTop: ".5rem"}}>
          <figure >
            <span className="icon__container icon-action-announcement" >
              <SvgIcon svgClass="icon icon__svg  icon-action-announcement" useHref="/assets/icons/action-sprite/svg/symbols.svg#announcement"/>
            </span>
            <figcaption className="p-top--x-small text-body--small">announcement</figcaption>
          </figure>
        </li>
      </ul>

  </div>

  <main className="site-content container">

      <div className="main" role="main">
        <div className="grid wrap" >
          <div className="col--padded size--1-of-1 small-size--1-of-2 large-size--1-of-2">
            <TimeLine/>
          </div>
          <div className="col--padded size--1-of-1 small-size--1-of-2 large-size--1-of-2">
            <SearchDialog/>
          </div>
        </div>
        <TabHeading/>
        <br/>


      </div>
  </main>
</div>

    );
  }
}
