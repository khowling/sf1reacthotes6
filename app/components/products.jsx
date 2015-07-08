'use strict';

import React, {Component} from 'react';
import { range, seq, compose, map, filter } from 'transducers.js';

import {TabHeading, SvgIcon} from './lowlevel.jsx';
import VelocityTransitionGroup from './utils/VelocityTransitionGroup.jsx';

import SFData from '../service/sfdata.es6';


export default class Products extends Component {

  constructor(props) {
    super(props);
    this.state = {searchtxt: '', showit: []};
  }

  componentDidMount() {

    Velocity.animate(
      React.findDOMNode(this.refs.p1).children,
      "transition.slideLeftIn", { stagger: 250 });


    let self = this,
        sf = SFData.instance;
    console.log ('calling query');
    //sf.query ('select name, type from account').then (
    sf.queryLocal ('Product__c', ["Name", "Description__c", "Category__c", "Brand__c", "Status__c", "Packaging__c", "ConfigMetaData__c", "ThumbImageB64__c", "Base_Price__c"]).then (
      function (value) {
        //console.log ('value : ' + JSON.stringify(value));
        self.setState ({showit: value});
      }, function (reason) {
        console.log ('reason : ' + JSON.stringify(reason));
      }
    )
  }
  render() {
    return (
      <div>
        <TabHeading icon={Products.navProps.icon} title={Products.navProps.name}/>
        <div ref="p1">
        { this.state.showit.map(function(item) { return (
          <ProductTile key={item.Id} data={item} />
        )})};
        </div>
      </div>
    )
  }
}
Products.navProps = {name: 'products', icon: 'product', nav: Products.name};

class ProductTile {
  render() {
    return (
      <div className="media tile tile--kanban" style={{marginTop: "4px"}}>
        <div className="media__figure">
          <span className="avatar avatar--circle avatar--small">
            <img src={"data:image/JPEG;base64,"+this.props.data.ThumbImageB64__c}/>
          </span>
        </div>
        <div className="media__body">
          <div className="tile">
            <div className="grid wrap">
              <div className="col size--1-of-1 text-body--regular">
                <span className="m-left--x-small float-right">
                  <span>{this.props.data.Base_Price__c}</span>
                </span>
                <p className="truncate">
                  <a href="#">{this.props.data.Name}</a>
                </p>
              </div>
              <div className="col text-body--small">
                <ul className="list--horizontal">
                  <li className="list__item list__item--separator">{this.props.data.Category__c}</li>
                  <li className="list__item list__item--separator">{this.props.data.Brand__c}</li>
                  <li className="list__item list__item--separator">{this.props.data.Packaging__c}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}
