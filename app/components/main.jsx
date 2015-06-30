'use strict';

import React, {Component} from 'react';
import Velocity from 'velocity-animate';
import 'velocity-animate/velocity.ui';

import {MenuNav, NavElement} from './menunav.jsx';


export default class Main extends Component {
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
