'use strict';

import React, {Component} from 'react';
import { range, seq, compose, map, filter } from 'transducers.js';

import {SvgIcon} from './lowlevel.jsx';
import VelocityTransitionGroup from './utils/VelocityTransitionGroup.jsx';

import SFData from '../service/sfdata.js6';


export default class ProductPage extends Component {
  render() {
    return (
      <ProductTile name="Platinum Package" price="$200,000" desc1="$8,000 p/m" desc2="25 Units"/>
    )
  }
}


class ProductTile {
  render() {
    return (
<div class="tile" label="[object Object]">
  <div class="grid wrap">
    <div class="col size--1-of-1 text-body--regular">
      <span class="m-left--x-small float-right">
        <span>{this.props.price}</span>
      </span>
      <p class="truncate">
        <a href="#">{this.props.name}</a>
      </p>
    </div>
    <div class="col text-body--small">
      <ul class="list--horizontal">
        <li class="list__item list__item--separator">{this.props.desc1}</li>
        <li class="list__item list__item--separator">{this.props.desc2}</li>
      </ul>
    </div>
  </div>
</div>
    )
  }
}
