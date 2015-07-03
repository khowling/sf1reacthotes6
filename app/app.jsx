'use strict';

import './index.html';
import './scss/app.scss';
import './scss/site.css';
import 'babel-core/polyfill';

import React from 'react';

import SFData from './service/sfdata.es6';

var sfd = new SFData ({
  host: _sfdccreds.host,
  access_token: _sfdccreds.session_api},
  [
    {
      sObject: "Account",
      primaryField: 'Name',
      allFields: ["Id", "Name", "Type", "Industry", "ShippingStreet", "ShippingCity", "ShippingPostalCode", "ShippingLatitude", "ShippingLongitude", "ThumbImageB64__c"],
      indexSpec:[{"path":"Id","type":"string"},{"path":"Name","type":"string"},{"path":"ShippingCity","type":"string"}]
    },
    {
      sObject: "Contact",
      primaryField: 'LastName',
      allFields: ["Id", "FirstName", "LastName", "Email", "khdev__Company__c", "MobilePhone", "MailingPostalCode"],
      indexSpec:[{"path":"Id","type":"string"},{"path":"LastName","type":"string"},{"path":"khdev__Company__c","type":"string"}]
    },
    {
      sObject: "Product__c",
		  primaryField: 'Name',
      allFields: ["Id", "Name", "Description__c", "Category__c", "Brand__c", "Status__c", "Packaging__c", "ConfigMetaData__c", "ThumbImageB64__c", "Base_Price__c"],
    	indexSpec:[{"path":"Id","type":"string"},{"path":"Name","type":"string"}, {"path":"Category__c","type":"string"}, {"path":"Brand__c","type":"string"}, {"path":"Status__c","type":"string"}, {"path":"Packaging__c","type":"string"}, {"path":"ThumbImageB64__c","type":"string"}]
    },
    {
      sObject:  "khdev__Order__c",
      primaryField: 'Name',
      indexSpec:[{"path":"Id","type":"string"},{"path":"Name","type":"string"}],
      allFields: ["Id", "khdev__Contact__c","khdev__OrderMetaData__c"],
      childLookupFields: { "khdev__Contact__c": "Contact"}
    }
  ]);


sfd.init();
console.log ('add listener for cordova deviceready');
document.addEventListener('deviceready', function() {
  console.log ('got cordova deviceready');
  sfd.cordovaReady(window.cordova);
});



import Main from './components/main.jsx';
import Products from './components/products.jsx';
import SearchDialog from './components/search.jsx';
import TimeLine from './components/timeline.jsx';
let [factories, navMeta] = function CreateFactories(...comps) {
  var factories = {};
  var navMeta = [];
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
  return [factories,  navMeta];
}(Main, Products, SearchDialog, TimeLine);


import Router from './components/router.jsx';
import MenuNav from './components/menunav.jsx';
import SyncProgress from './components/syncprogress.jsx';

React.render(
  <div>
    <MenuNav menuItems={navMeta}/>
    <SyncProgress/>
    <main className="site-content container">
      <Router componentFactories={factories}/>
    </main>
  </div>,
  document.getElementById('app')
);
