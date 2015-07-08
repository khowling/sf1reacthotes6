'use strict';

import MockStore from './mockstore.es6';

let instance = null;
const SF_API_VERSION = '/services/data/v32.0';
export default class SFData {


  constructor (creds, soups) {
    if (instance) {
      throw "SFData() only allow to construct once";
    }
    this._host = creds.host;
    this._access_token = creds.access_token;
    this._soups = soups;
    this._smartStore = new MockStore(this._soups);
    instance = this;
  }

  static get instance() {
    if (!instance) throw "SFData() need to construct first";
    return instance;
  }

  _syncDown(target, soupName, options, callback) {
    // target {type:"soql", query:"<soql query>"}
    // optinos {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}
    // callback called:
      //  once the sync has started.
      // When the internal REST request has completed
      // After each page of results is downloaded
    this.query (target.query).then (
       (value) => {
         //console.log ('sussess value : ' + value.length);
         this._smartStore.upsertSoupEntriesWithExternalId(soupName, value, "Id",
             function (valueSoup) {
               //console.log ('upsert success: ' + JSON.stringify(valueSoup));
               callback ({success: true, recordsSynced: value.length});
             }, function (reasonSoup) {
               //console.log ('upsert error: ' + JSON.stringify(reasonSoup));
               callback ({success: false, message: "upsertSoupEntriesWithExternalId: " + JSON.stringify(reasonSoup)});
             });
       }, (reason) => {
         //console.log ('error reason : ' + JSON.stringify(reason));
         callback ({success: false, message: "query: " + JSON.stringify(reason)});
       });

  }

  _syncUp (target, soupName, options, callback) {
    // options: {fieldlist:[], mergeMode: “OVERWRITE” }
  }

  static _buildSOQL (obj, fields, where, orderby, soupQuery) {
    let qstr = "SELECT " + fields.map(f => soupQuery? "{" + obj + ":" + f + "}" : f).join(', ') + " FROM " + (soupQuery? "{" + obj + "}" : obj);
    if (where) {
      let wildcard = soupQuery ? "%" : "%25";
      qstr += " WHERE " + where.map(i =>
        i.f +
        i.contains && (" LIKE '" + wildcard + i.contains + wildcard + "'") ||
        i.like && (" LIKE '" + i.like + wildcard + "%'") ||
        i.equals && (" = '" + i.equals + "'") || ''
        ).join(' AND ');
    }
    if (orderby)
      qstr += " ORDER BY " + soupQuery? "{" + obj + ":" + orderby + "}" : orderby ;
    console.log ('_buildSOQL: ' + qstr);
    return qstr;
  }

  syncAll (progressCallback) {
    progressCallback({progress: 0.5, msg: this._soups[0].sObject});
    this.syncDownSoup (this._soups[0]).then ( (success) => {
      progressCallback({progress: 1, msg: this._soups[2].sObject});
      this.syncDownSoup (this._soups[2]).then ( (success) => {
        progressCallback({progress: 0, msg: "last sync just now"});
      }, function (fail) {
        progressCallback({progress: -1, msg: "Error: " + fail});
      });
    });
  }

  syncDownSoup (soupMeta) {
    var promise = new Promise( (resolve, reject) => {
      this._syncDown(
        {type:"soql", query:SFData._buildSOQL (soupMeta.sObject, soupMeta.allFields)},
        soupMeta.sObject,
        {mergeMode:"Force.MERGE_MODE_DOWNLOAD.OVERWRITE"},
        (syncDownValue) => {
          if (syncDownValue.success) {
            resolve(syncDownValue.recordsSynced);
          } else {
            reject(syncDownValue.message);
          }
        })
    });
    return promise;
  }

  queryLocal(obj, fields , where) {
    var promise = new Promise( (resolve, reject) => {

      let qspec;
      let smartqsl;

      let soup = this._soups.find (s => s.sObject === obj ),
          smartstore = this._smartStore;

      if (!soup) reject("Object not found");

      if (!where || where.length == 0) {
        console.log ('offline search running buildAllQuerySpec : ' + soup.primaryField);
        qspec = smartstore.buildAllQuerySpec (soup.primaryField, null, 100);
      }
      else if (where.length == 1 && where[0].equals) {
        console.log ('offline search running buildExactQuerySpec : ' + where[0].field + ' = ' + where[0].equals);
        qspec = smartstore.buildExactQuerySpec (where[0].field, where[0].equals, null, 100);
      }
      else if (where.length == 1 && where[0].like) {
        console.log ('offline search running buildLikeQuerySpec : ' + where[0].field + ' = ' + where[0].equals);
        qspec = smartstore.buildLikeQuerySpec (where[0].field, where[0].like + "%", null, 100);
      }
      else {
        // SmartQuery requires Everyfield to be indexed & ugly post processing ! the others do not!
        smartqsl = SFData._buildSOQL (soup.sObject, fields, null, null, true);
        console.log ('offline search running smartqsl : ' + smartqsl);
        qspec = smartstore.buildSmartQuerySpec(smartqsl, 100);
      }

      var success = function (val) {
        //console.log ('querySoup got data ' + JSON.stringify(val));
        if (smartqsl) { // using smartSQL, need to do some reconstruction UGH!!!
          var results = [];
          for (var rrecidx in val.currentPageOrderedEntries) {
            var res = {},
              rrec = val.currentPageOrderedEntries[rrecidx];
            for (var fidx in fields) {
              res[fields[fidx]] = rrec[fidx];
            }
            results.push (res);
          }
          resolve(results);
        } else {
          resolve(val.currentPageOrderedEntries);
        }
      }

      var error = function (val) {
        //console.log  ('querySoup error ' + JSON.stringify(val));
        reject(val);
      }

      if (smartqsl) {
        //console.log ('queryLocal() runSmartQuery ' + qspec);
        smartstore.runSmartQuery(qspec, success, error);
      } else {
        //console.log ('queryLocal() querySoup ' + qspec);
        smartstore.querySoup(soup.sObject, qspec, success, error);
      }

    });
    return promise;
  }

  query(soql) {
    // Creating a promise
      var promise = new Promise( (resolve, reject) => {
        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        client.open('GET', this._host + SF_API_VERSION + '/query.json?q=' + encodeURIComponent(soql));
        client.setRequestHeader ("Authorization", "OAuth " + this._access_token);
        client.send();
        client.onload = function () {
          if (this.status == 200) {
            // Performs the function "resolve" when this.status is equal to 200
            //console.log ('got records : ' + this.response);
            resolve(JSON.parse(this.response).records);
          } else {
            // Performs the function "reject" when this.status is different than 200
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });
      return promise;
  }
}
