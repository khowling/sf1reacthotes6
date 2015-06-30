
'use strict';

import React, {Component} from 'react';
import {SvgIcon} from './lowlevel.jsx';

export default class MenuNav extends Component {

  constructor(props) {
    super(props);
    this.state = {menuopen: false};
  }
  toggleMenu() {
    if (!this.state.menuopen) {
      Velocity.animate(
        React.findDOMNode(this.refs.navbutton),
        {rotateZ: "45deg"});
      Velocity.animate(
          React.findDOMNode(this.refs.navactions),
          "transition.slideUpIn",
          {stagger: 100});
          this.setState ({menuopen: true});
      } else {
        Velocity.animate(
          React.findDOMNode(this.refs.navbutton),
          {rotateZ: "0deg"});
        Velocity.animate(
            React.findDOMNode(this.refs.navactions),
            "transition.slideDownOut",
            {stagger: 100});
        this.setState ({menuopen: false});
      }
  }

  componentDidMount() {

    Velocity.animate(
      React.findDOMNode(this.refs.navbutton),
      "transition.whirlIn",
      { delay: 1000 });

  }

  render() {
    var self = this;
    return (
<div>
  <a ref="navbutton" style={{display: "none", position: "fixed",  bottom: "30px",  right: "5%", zIndex: "3"}} onClick={this.toggleMenu.bind(this)}>
    <span style={{padding: "0.5rem"}}>
      <SvgIcon svgClass="icon icon__svg icon-action-dial-in nav_icon" useHref="/assets/icons/action-sprite/svg/symbols.svg#dial_in"/>
    </span>
  </a>

  <div ref="navactions"  style={{display: "none", borderTop: "1px solid #d8dde6", background: "white", position: "fixed",  bottom: "0px",  left: "0", right: "0", zIndex: "2"}}>

      <ul className="grid wrap icon-grid" >
        { self.props.menuItems.map(function(item) { return (
          <li className="col--padded m-bottom--x-large" style={{marginBottom: ".75rem", marginTop: ".75rem"}}>
            <a href={"#"+item.nav} onClick={self.toggleMenu.bind(self)}>
              <figure>
                <SvgIcon svgClass={"icon icon__svg  icon-standard-"+item.icon+" icon--large"} useHref={"/assets/icons/standard-sprite/svg/symbols.svg#"+item.icon}/>
                <figcaption className="p-top--x-small text-body--small">{item.name}</figcaption>
              </figure>
            </a>
          </li>
        )})}
      </ul>

  </div>
</div>

    );
  }
}
MenuNav.propTypes = { menuItems: React.PropTypes.array };
MenuNav.defaultProps = { menuItems: [] };


export  class NavHome extends Component {


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
