'use strict';

import React, {Component} from 'react';

import Nav from './menunav.jsx';
import {SvgIcon} from './lowlevel.jsx';
import {SearchDialog, TabHeading} from './search.jsx';

export default class Main extends Component {


  render() {
    return (

  <div className="container container--large container--center">

      <header role="banner">
        <h1 className="text-heading--label m-bottom--small">Salesforce Design System Tutorial</h1>
      </header>

      <div className="main" role="main">
        <TabHeading/>
        <SearchDialog/>
        <Nav></Nav>

      </div>
  </div>

    );
  }
}
