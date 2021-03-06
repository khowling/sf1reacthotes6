'use strict';

import React, {Component} from 'react';
import { range, seq, compose, map, filter } from 'transducers.js';

import {TabHeading, SvgIcon} from './lowlevel.jsx';

import SFData from '../service/sfdata.es6';


export default class Customers extends Component {

  constructor(props) {
    super(props);
    this.state = {searchtxt: '', showit: []};
  }

  handleChange(e) {
    console.log ('change: ' + e.target.value);
    this.setState({searchtxt: e.target.value, showit: filter (this.state.allrecs, x => x.Name.includes(e.target.value))});
  }

  componentDidMount() {
    let self = this,
        sf = SFData.instance;
    console.log ('calling query');
    //sf.query ('select name, type from account').then (
    sf.queryLocal ('Account', ['Name', 'Type']).then (
      function (value) {
        //console.log ('value : ' + JSON.stringify(value));
        self.setState ({showit: value, allrecs: value});
      }, function (reason) {
        console.log ('reason : ' + JSON.stringify(reason));
      }
    )
  }

  render() {
      return (

        <div className="lookup" data-select="multi" data-scope="single" data-typeahead="true">

          <TabHeading icon={Customers.navProps.icon} title={Customers.navProps.name}/>

          <div className="form-element m-bottom--small">
            <div className="lookup__control input-has-icon input-has-icon--right">
              <SvgIcon svgClass="input__icon" useHref="/assets/icons/utility-sprite/svg/symbols.svg#search"/>
              <input id="lookup" className="input--bare" type="text" label="Lookup Label"  value={this.state.searchtxt} onChange={this.handleChange.bind(this)}/>
            </div>
          </div>

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
      </div>
    );
  }
}
Customers.navProps = {name: 'my customers', icon: 'opportunity', nav: Customers.name};
