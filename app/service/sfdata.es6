'use strict';

const SF_API_VERSION = '/services/data/v32.0';

var access_token, host;

export class MockStore {

  constructor(soups) {
    this._store = {};
    // register soups
    for (var sname in soups) {
      this._store[sname] = [];
    }
  }

  _find (obj, key, val) {
    var sobjs = this._store[obj];
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
    var sobjs = this._store[obj];
    for (var r in records) {
      var rec = records[r];
      var exist = _find(obj, keyfld, rec[keyfld]);
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
    success (records);
  }

  registerSoup (sname, idxes, success, error) {
    console.log ('SFDCMockStore registerSoup : ' + sname);
    this._store[sname] = [];
    success();
  }

  removeSoup (sname, success, error) {
    console.log ('SFDCMockStore removeSoup : ' + sname);
    this._store[sname] = [];
    success();
  }

  upsertSoupEntries (obj, records, success, error) {
    this.upsertSoupEntriesWithExternalId (obj, records, "_soupEntryId", success, error);
  }


  buildAllQuerySpec: function(field, order, limit) {
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
    console.log ('SFDCMockStore querySoup : ' + obj +' : ' + angular.toJson (qspec));
    var sobjs = this._store[obj];
    if (!qspec.field) {
      success ( {currentPageOrderedEntries:angular.copy (sobjs)});
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
      success( {currentPageOrderedEntries: angular.copy (res)});
    } else {
      success ({currentPageOrderedEntries:[]});
    }
  }
}

let SFDatasingleton = Symbol();
export default class SFData {

  static get instance() {
    if(!this[SFDatasingleton]) {
      throw "need to Construct SFData first";
    }
    return this[SFDatasingleton];
  }

  static set access_token(value) {
    access_token = value;
    console.log ('setting ' + access_token);
  }
  static set host(value) {
  host = value;
  console.log ('setting ' + host);
  }

  constructor (creds, soups) {
    this._host = creds.host;
    this._access_token = creds.access_token;
    this._soups
    this._smartStore = new MockStore(_soups);
    this[SFDatasingleton] = this;
  }

  _syncDown(target, soupName, options, callback) {
    // target {type:"soql", query:"<soql query>"}
    // optinos {mergeMode:Force.MERGE_MODE_DOWNLOAD.OVERWRITE}
    // callback called:
      //  once the sync has started.
      // When the internal REST request has completed
      // After each page of results is downloaded
      SFDCData.query ("Contact",  "*", null).then(function () {
  }

  _syncUp(target, soupName, options, callback) {
    // options: {fieldlist:[], mergeMode: “OVERWRITE” }

  }


  _buildSOQL (obj, fields, where, orderby) {

    var formatfld = function (obj, field, smart) {
      if (!smart)
        return field;
      else
        return "{" + obj + ":" + field + "}";
    }

    let qstr = "SELECT " + fields.map(String).join(', ') + " FROM " + obj;
    if (where)
      qstr += " WHERE " + where.map(i =>
        i.f +
        i.contains && (" LIKE '%25" + i.contains + "%25'") ||
        i.like && (" LIKE '" + i.like + "%25'") ||
        i.equals && (" = '" + i.equals + "'") || throw 'invalid where'
        ).join(' AND ');
    if (orderby)
      qstr += " ORDER BY " + orderby;
    return qstr;
  }

  syncDownSoup (soupMeta) {
    var promise = new Promise( function (resolve, reject) {
       this.query (_buildSOQL (soupMeta.sObject, soupMeta.allFields)).then (
          function (value) {
            console.log ('sussess value : ' + JSON.stringify(value));
            this._smartStore.upsertSoupEntriesWithExternalId(soupMeta.sObject, value.records, "Id",
                function (valueSoup) {
                  console.log ('upsert success: ' + JSON.stringify(valueSoup));
                  resolve(value.records.length);
                }, function (reasonSoup) {
                  console.log ('upsert error: ' + JSON.stringify(reasonSoup));
                  reject (JSON.stringify(reasonSoup))
                });

          }, function (reason) {
            console.log ('error reason : ' + JSON.stringify(reason));
            reject (JSON.stringify(reason);
          });
  }




  static query(soql) {
    // Creating a promise
      var promise = new Promise( function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        client.open('GET', _host + SF_API_VERSION + '/query.json?q=' + encodeURIComponent(soql));
        client.setRequestHeader ("Authorization", "OAuth " + _access_token);
        client.send();

        client.onload = function () {
          if (this.status == 200) {
            // Performs the function "resolve" when this.status is equal to 200
            resolve(JSON.parse(this.response));
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
