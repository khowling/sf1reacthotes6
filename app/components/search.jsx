'use strict';

import React, {Component} from 'react';
import { range, seq, compose, map, filter } from 'transducers.js';

import {SvgIcon} from './lowlevel.jsx';
import VelocityTransitionGroup from './utils/VelocityTransitionGroup.jsx';

import SFData from '../service/sfdata.js6';

export class TabHeading extends Component {

  render() {
    return (
    <section aria-labelledby="anchor-component">
      <h2 id="anchor-component" className="text-heading--large p-top--medium p-bottom--medium">Components/Anchor</h2>

      <div className="anchor anchor--rec-home">
        <div className="grid grid--align-spread">
          <div className="media col media--rec-home">
            <div className="media__figure">
              <SvgIcon svgClass="icon icon--large icon-standard-user" useHref="/assets/icons/standard-sprite/svg/symbols.svg#user"/>
            </div>
            <div className="media__body">
              <p className="text-heading--label">Record Type</p>
              <div className="grid">
                <div className="col">
                  <h1 className="text-heading--medium media--rec-home__title truncate">Record Title</h1>
                </div>
                <div className="col shrink-none align-bottom">
                  <button className="button button--neutral not-selected" aria-live="assertive">
                    <span className="text-not-selected">
                      <SvgIcon svgClass="button__icon--stateful button__icon--left" useHref="/assets/icons/utility-sprite/svg/symbols.svg#add"/>
                      Follow
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col shrink-none align-bottom">
            <div className="button-group" role="group">
              <button className="button button--neutral">Action 1</button>
              <button className="button button--neutral">Action 2</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
  }
}

export  class SearchDialog extends Component {

  constructor(props) {
    super(props);
    this.state = {searchtxt: '', showit: []};
  }

  handleChange(e) {
    console.log ('change: ' + e.target.value);
    this.setState({searchtxt: e.target.value, showit: filter (this.state.allrecs, x => x.Name.includes(e.target.value))});
  }

  componentDidMount() {
    let self = this;
    SFData.query ('select name, type from account').then (
      function (value) {
        console.log ('value : ' + JSON.stringify(value));
        self.setState ({showit: value.records, allrecs: value.records});
      }, function (reason) {
        console.log ('reason : ' + JSON.stringify(reason));
      }
    )
  }

  render() {
    console.log ('rendering: ' + JSON.stringify (this.state.showit));
    this.state.showit.map(function(item) { console.log (item.Name);});
      return (


      <div className="modal__content">
        <div className="lookup" data-select="multi" data-scope="single" data-typeahead="true">
          <div className="form-element m-bottom--small">
            <div className="lookup__control input-has-icon input-has-icon--right">
              <SvgIcon svgClass="input__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#search"/>
              <input id="lookup" className="input--bare" type="text" label="Lookup Label"  value={this.state.searchtxt} onChange={this.handleChange.bind(this)}/>
            </div>
          </div>
          <VelocityTransitionGroup transitionName="slide-forward">
          <table className="table table--bordered" role="listbox">
            <thead>
              <tr className="no-hover">
                <th colSpan="4">
                  <div className="button-group float-right">
                    <button className="button button--icon-bare button--icon-border-small">
                      <SvgIcon svgClass="button__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#filterList"/>
                      <span className="assistive-text">Filter List</span>
                    </button>
                    <button className="button button--icon-bare button--icon-border-small">
                      <SvgIcon svgClass="button__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#sort"/>
                      <span className="assistive-text">Sort</span>
                    </button>
                  </div>5 Results, sorted by relavency</th>
              </tr>
              <tr>
                <th>Account Name</th>
                <th>Location</th>
                <th>Secondary Column</th>
                <th>Tertiary Column</th>
              </tr>
            </thead>

            <tbody>

                { this.state.showit.map(function(item) { return (
              <tr key={item.key}>
                <td>
                  <a href="#" role="option">
                    <SvgIcon svgClass="icon icon-standard-account icon--small m-right--x-small" useHref="/assets/icons/standard-sprite/svg/symbols.svg#account"/>
                    {item.Name}</a>
                </td>
                <td>{item.Type}</td>
                <td>ttt</td>
                <td>ttt</td>
              </tr>
          ) })}

            </tbody>

          </table>
        </VelocityTransitionGroup>
        </div>
      </div>


);
}
}
