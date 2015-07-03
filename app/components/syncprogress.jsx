
'use strict';

import React, {Component} from 'react';
import {SvgIcon} from './lowlevel.jsx';
import ProgressBar from 'progressbar.js'


export default class SyncProgress extends Component {

  constructor(props) {
    super(props);
    this.state = {syncopen: true};
  }

  componentDidMount() {

    var progressBar = new ProgressBar.Circle(React.findDOMNode(this.refs.syncbar), {
          color: '#FCB03C',
          strokeWidth: 2,
          trailWidth: 2,
          duration: 4500,
          text: {
              value: 'sync 0%',
              className: 'text-heading--label'
          },
          step: function(state, bar) {
              bar.setText('sync ' + (bar.value() * 100).toFixed(0) + '%');
          }
      });
      progressBar.animate(1, () =>
        this.setState ({syncopen:false})
      )


  }

  openSync() {
    console.log ('open');
  }

  render() {
    var self = this;
    var display = this.state.syncopen ? 'fixed' : 'none';
    return (
        <div style={{display: display, position: "fixed",  bottom: "25px",  left: "2%", zIndex: "3", width: "40px", hight: "40px"}} onClick={this.openSync.bind(this)}>
          <div ref="syncbar"/>
        </div>
    );
  }
}
