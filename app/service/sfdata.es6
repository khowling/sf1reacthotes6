'use strict';

export class MockStore {

  constructor(soups) {
    if (window.localStorage)
      this._store = window.localStorage;
    else
      this._store = {};
    // register soups
    soups.forEach(s => this._store[s.sObject] = JSON.stringify([]));
  }

  _find (obj, key, val) {
    var sobjs = JSON.parse(this._store[obj]);
    if (val) {
        //console.log ('_find, for each existing record ' + sobjs.length);
      for (var i in sobjs) {
        var r = sobjs[i];
        //console.log ('_find, testing ' + r[key] + ' == ' + val);
        if (r[key] == val) {
          return i;
        }
      }
    }
    return -1;
  }

  upsertSoupEntriesWithExternalId  (obj, records, keyfld, success, error) {
    console.log ('SFDCMockStore upsertSoupEntriesWithExternalId '+obj+' on : ' + keyfld);
    var sobjs = JSON.parse(this._store[obj]);
    for (var r in records) {
      var rec = records[r];
      var exist = this._find(obj, keyfld, rec[keyfld]);
      if (exist == -1) {
        console.log ('SFDCMockStore upsertSoupEntriesWithExternalId, inserting key record: ' + rec[keyfld]);
        rec._soupEntryId = sobjs.length +1;
        sobjs.push (rec);
      } else {
        console.log ('SFDCMockStore upsertSoupEntriesWithExternalId, updating existing key : ' + rec[keyfld]);
        // sobjs[exist] = rec
        // real store merges the data!
        for (var elidx in rec) {
          sobjs[exist][elidx] = rec[elidx];
        }
      }
    }
    this._store[obj] = JSON.stringify(sobjs);
    success (records);
  }

  registerSoup (sname, idxes, success, error) {
    console.log ('SFDCMockStore registerSoup : ' + sname);
    this._store[sname] = JSON.stringify([]);
    success();
  }

  removeSoup (sname, success, error) {
    console.log ('SFDCMockStore removeSoup : ' + sname);
    this._store.removeItem(sname);
    success();
  }

  upsertSoupEntries (obj, records, success, error) {
    this.upsertSoupEntriesWithExternalId (obj, records, "_soupEntryId", success, error);
  }


  buildAllQuerySpec (field, order, limit) {
    return {};
  }

  buildExactQuerySpec (field, equals, order, limit) {
    return {"field": field, "equals": equals};
  }

  buildLikeQuerySpec (field, like, order, limit) {
    return {"field": field, "like": like.substring(0, like.length -1)};
  }

  buildSmartQuerySpec (smartqsl, limit) {
    return {"smartsql": smartqsl};
  }

  runSmartQuery (qspec, success,error) {
    // TODO
  }

  querySoup  (obj, qspec, success,error) {
    console.log ('SFDCMockStore querySoup : ' + obj +' : ' + JSON.stringify (qspec));
    var sobjs = JSON.parse(this._store[obj]);
    if (!qspec.field) {
      success ( {currentPageOrderedEntries: Array.from (sobjs)});
    } else if (qspec.field) {

      var res = [];
      for (var r in sobjs) {
        var rec = sobjs[r];
        var cval = rec[qspec.field];
        if (cval) {
          if (qspec.like && cval.indexOf(qspec.like) > -1) {
            res.push (rec);
          } else if (qspec.equals && qspec.equals == cval) {
            res.push (rec);
          }
        }
      }
      success( {currentPageOrderedEntries: Array.from (res)});
    } else {
      success ({currentPageOrderedEntries:[]});
    }
  }
}

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

    //SFDCData.query ("Contact",  "*", null).then(function () {
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

  init () {
    this.syncDownSoup (this._soups[0]).then ( (success) => {
      this.syncDownSoup (this._soups[2]).then ( (success) => {
        console.log ('finished');
      }, function (fail) {console.log ('error');});
    });
  }

  syncDownSoup (soupMeta) {
    var promise = new Promise( (resolve, reject) => {
       this.query (SFData._buildSOQL (soupMeta.sObject, soupMeta.allFields)).then (
          (value) => {
            console.log ('sussess value : ' + value.length);
            this._smartStore.upsertSoupEntriesWithExternalId(soupMeta.sObject, value, "Id",
                function (valueSoup) {
                  console.log ('upsert success: ' + JSON.stringify(valueSoup));
                  resolve(value.length);
                }, function (reasonSoup) {
                  console.log ('upsert error: ' + JSON.stringify(reasonSoup));
                  reject (JSON.stringify(reasonSoup))
                });

          }, (reason) => {
            console.log ('error reason : ' + JSON.stringify(reason));
            reject (JSON.stringify(reason));
          });
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
        console.log ('querySoup got data ' + JSON.stringify(val));
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
        console.log  ('querySoup error ' + JSON.stringify(val));
        reject(val);
      }

      if (smartqsl) {
        console.log ('queryLocal() runSmartQuery ' + qspec);
        smartstore.runSmartQuery(qspec, success, error);
      } else {
        console.log ('queryLocal() querySoup ' + qspec);
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
