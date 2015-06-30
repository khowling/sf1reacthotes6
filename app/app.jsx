'use strict';

import './index.html';
import './scss/app.scss';
import './scss/site.css';
import 'babel-core/polyfill';

import React, {Component} from 'react';

import SFData from './service/sfdata.js6';
SFData.host = _sfdccreds.host;
SFData.access_token = _sfdccreds.session_api;


function CreateFactories(...comps) {
  var res = {};
  for (let mods of comps) {
    console.log ('import mods : ' + mods);
    if (typeof mods === "function" ) {
      console.log ('creating factory : ' + mods.name);
      res[mods.name] = React.createFactory(mods);
    } else {
      for (let el of mods) {
        if (typeof el  === "function" ) {
          console.log ('creating factory : ' + el.name);
          res[el.name] = React.createFactory(el);
        }
      }
    }
  }
  return res;
}



var _RouterInitialised = false;

class Router extends Component {

    static getURLNav (lnkhash) {
      var gethash = lnkhash || decodeURI(
        // We can't use window.location.hash here because it's not
        // consistent across browsers - Firefox will pre-decode it!
        // window.location.pathname + window.location.search
        window.location.href.split('#')[1] || ''
      ) || 'Main';
      console.log ('App _getURLNav url changed : ' + gethash);
      let [comp, parms] = gethash.split('?');
      let paramjson = {};
      if (typeof parms !== 'undefined') {
        let tfn = x => {
          let [n, v] = x.split('=');
          if (n === 'gid') {
            let [view, id] = v.split (':');
            paramjson.view = view;
            paramjson.id = id;
          } else
            paramjson[n] = v;
          };

        if (parms.indexOf ('&') > -1)
          parms.split('&').map (tfn);
        else
          tfn (parms);
      }
      return ({hash: comp, params: paramjson});
    }

    static setupRouterfunction (onPopState) {

      if (!_RouterInitialised) {
        if (true) { // use HTML5 history
          if (window.addEventListener) {
            window.addEventListener('popstate', onPopState, false);
          } else {
            window.attachEvent('popstate', onPopState);
          }
        } else {
          if (window.addEventListener) {
            window.addEventListener('hashchange', onHashChange, false);
          } else {
            window.attachEvent('onhashchange', onHashChange);
          }
        }
        _RouterInitialised = true;
      }
    }

    constructor (props) {
      super (props);
      Router.setupRouterfunction ( () => {
        var newComp = Router.getURLNav();
        console.log ('App url changed : ' + JSON.stringify(newComp));
        //if (newComp !== this.state.renderThis) {
          this.setState ({renderThis: newComp.hash, urlparam: newComp.params});
        //};
      });

      var newComp = Router.getURLNav();
      console.log ('App Initial URL : ' + JSON.stringify(newComp));
      this.state =  {renderThis: newComp.hash, urlparam: newComp.params, formdata: []};
    }

    navTo (element) {
      let href, newComp;
      if (typeof element === 'object') {
        event.preventDefault();
        //var newComp = $(event.target).attr('href').substring(1);
        href = $(element.currentTarget).attr('href').substring(1);
        newComp = Router.getURLNav (href);
      } else if (typeof element === 'string') {
        href = element;
        newComp = Router.getURLNav (href);
      }
      // HTML5 history API
      history.pushState({}, "page", "/#" + href);
      console.log ('App navTo ' + JSON.stringify(newComp));
      //if (newComp !== this.state.renderThis) {
      this.setState ({renderThis: newComp.hash, urlparam: newComp.params});
      //}
    }

    render() {
      console.log ('App render() - returning new Component: ' + this.state.renderThis);

      //if (this.state.renderThis === 'Main') {
      //  return React.createElement (Main,
      //    {key: JSON.stringify(this.state.urlparam),
      //     navTo: this.navTo,
      //     urlparam: this.state.urlparam});
      if (compfact[this.state.renderThis]) {
          console.log ('App render() - returning new Component ' + this.state.renderThis);
          return compfact[this.state.renderThis](
            {key: JSON.stringify(this.state.urlparam),
             navTo: this.navTo,
             urlparam: this.state.urlparam});
      } else return (
          <div>404 {this.state.renderThis}</div>
      )
    }
}

import Main from './components/main.jsx';
import Products from './components/products.jsx';
import {SearchDialog, TabHeading} from './components/search.jsx';
import TimeLine from './components/timeline.jsx';
var compfact = CreateFactories(Main, Products, SearchDialog, TabHeading, TimeLine);
var menuItems = [
  {name: 'my dashboard', icon: 'dashboard', nav: ''},
  {name: 'products', icon: 'product', nav: 'Products'},
  {name: 'my orders', icon: 'opportunity', nav: 'SearchDialog'},
  {name: 'my day', icon: 'event', nav: 'TimeLine'}];

import MenuNav from './components/menunav.jsx';

React.render(
  <div>
    <MenuNav menuItems={menuItems}/>
    <main className="site-content container">
      <Router/>
    </main>
  </div>,
  document.getElementById('app')
);
