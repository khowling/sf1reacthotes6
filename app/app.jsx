'use strict';

import './index.html';
import './scss/app.scss';
import './scss/site.css';
import 'babel-core/polyfill';

import React, {Component} from 'react';
import SFData from './service/sfdata.es6';
import Router from './components/router.jsx';

import Home from './components/home.jsx';
import Products from './components/products.jsx';
import Customers from './components/customers.jsx';
import TimeLine from './components/timeline.jsx';


import MenuNav from './components/menunav.jsx';
import SyncProgress from './components/syncprogress.jsx';


class App extends Component {

  constructor () {
    super();
    this.sfd = new SFData (
      [
        {
          sObject: "Account",
          primaryField: 'Name',
          allFields: ["Id", "Name", "Type", "Industry", "ShippingStreet", "ShippingCity", "ShippingPostalCode", "ShippingLatitude", "ShippingLongitude", "ThumbImageB64__c"],
          indexSpec:[{"path":"Id","type":"string"},{"path":"Name","type":"string"},{"path":"ShippingCity","type":"string"}]
        },
        {
          sObject: "Product__c",
          primaryField: 'Name',
          allFields: ["Id", "Name", "Description__c", "Category__c", "Brand__c", "Status__c", "Packaging__c", "ConfigMetaData__c", "ThumbImageB64__c", "Base_Price__c"],
          indexSpec:[{"path":"Id","type":"string"},{"path":"Name","type":"string"}, {"path":"Category__c","type":"string"}, {"path":"Brand__c","type":"string"}, {"path":"Status__c","type":"string"}, {"path":"Packaging__c","type":"string"}, {"path":"ThumbImageB64__c","type":"string"}]
        },
        {
          sObject: "Contact",
          primaryField: 'LastName',
          allFields: ["Id", "FirstName", "LastName", "Email", "AccountId", "MobilePhone", "MailingPostalCode"],
          indexSpec:[{"path":"Id","type":"string"},{"path":"LastName","type":"string"},{"path":"khdev__Company__c","type":"string"}],
          childLookupFields: { "AccountId": "Account"}
        },
        {
          sObject:  "khdev__Order__c",
          primaryField: 'Name',
          indexSpec:[{"path":"Id","type":"string"},{"path":"Name","type":"string"}],
          allFields: ["Id", "khdev__Contact__c","khdev__OrderMetaData__c"],
          childLookupFields: { "khdev__Contact__c": "Contact"}
        }
      ]);

      // ES6 Destructuring Assignment
      this.appComponents = App.createFactories (Home, Products, Customers, TimeLine);
      this.state = {showSync: false, bootmsg: 'booting'};

      this.routeUpdated = this.routeUpdated.bind(this);
  }

  static createFactories (...comps) {
    let factories = [],
        navMeta = [];

    for (let mods of comps) {
      //console.log ('import mods : ' + mods);
      if (typeof mods === "function" ) {
        if (mods.navProps) {
          //console.log ('creating factory : ' + mods.name);
          factories[mods.name] = React.createFactory(mods);
          navMeta.push (mods.navProps);
        }
      }
    }
    return {factories: factories, navMeta: navMeta};
  }

  componentWillMount() {
    console.log ('APP componentWillMount: setting up services');
    if (this.props.cordova) {
      //this.setState ({ bootmsg:  'got cordova deviceready'});
      this.sfd.cordovaReady(this.props.cordova).then (() => {
          this.setState ({ booted: true, bootmsg: 'cordova ready'});
      }, (error) => {
          this.setState ({ bootmsg: 'error ' + error});
      });
    };

    if (this.props.sfdccreds) {
      this.setState ({ bootmsg:  'loading data....'});
      this.sfd.webReady(this.props.sfdccreds, this.props.mockSync).then (() => {
          this.setState ({ booted: true, bootmsg: 'local ready'});
        }, (error) => {
            this.setState ({ bootmsg: 'error ' + error});
        });
    }
  }

  routeUpdated (newRoute) {
      console.log ('App: route updated ' + newRoute);
      let currentNav = this.appComponents.navMeta.find(r => r.nav === newRoute);
      this.setState ({showSync: (currentNav && currentNav.showSync)})
  }



  render () {
    console.log ('APP rendering: ' + this.state.bootmsg);
    if (this.state.booted) {
      return (
        <div>

          <MenuNav menuItems={this.appComponents.navMeta}/>
          { this.state.showSync &&
          <SyncProgress sfd={this.sfd}/>
          }
          <main className="site-content container">
            <Router componentFactories={this.appComponents.factories} updateRoute={this.routeUpdated}/>
          </main>
        </div>
      )
    } else return (
      <div>{this.state.bootmsg}</div>
    );
  }
}

document.getElementById("app").innerHTML =  'waiting for deviceready ' + window.location.href;
document.addEventListener('deviceready', function() {
      React.render(<App cordova={window.cordova}/>,  document.getElementById('app'));
});

if (window.location.href.indexOf ('localhost') >0 || window.location.href.indexOf ('salesforce.com') >0) {
  React.render(<App sfdccreds={_sfdccreds} mockSync={true} />,  document.getElementById('app'));
}
