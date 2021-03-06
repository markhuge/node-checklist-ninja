/*jshint node: true */

var request = require('request'),
    json    = require('JSONStream'),
    es      = require('event-stream'),
    crypto  = require('crypto'),
    baseURI = 'https://api.checklist.ninja',
    merge   = require('lodash.merge'),
    url     = require('url');

// defaults
this._config = { host: baseURI };

// prepare payloads
function parsePayload(input) {
  if (typeof input === "object") { return input; }
  var obj = { title: input };
  return obj;
}

this.config = function (config) {
  if (config) { this._config = merge(this._config,config); }
  return this._config;
};

this.sign = function (method, resource, date) {
  var parsedUrl = url.parse(resource);
  var str     = this._config.secret + '\n' + date + '\n' + method + '\n' + parsedUrl.pathname + '\n',
      shasum  = crypto.createHash('sha1'); // this may be okay at higher scope
  
  shasum.update(str);
  return shasum.digest('hex');
};

this.date = function () {
  return new Date().toUTCString();
};

this.raw = function (method, endpoint, payload, callback) {
  if (arguments.length === 3) {
    callback = payload;
  }

  var date    = this.date(),
      sig     = this.sign(method, endpoint, date),
      headers = {
        'authorization': 'ChecklistNinja ' + this._config.pubkey +  ':' + sig,
        'date'         : date
      },
      options = { url: this._config.host + endpoint, method: method, headers: headers };

  if (arguments.length === 4) {
    options.body = JSON.stringify(payload);
  }

  request(options, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 204) {
        return callback(undefined, response.statusCode, null);
      }
      return callback(undefined, response.statusCode, JSON.parse(body));
    }
    return callback(error, null, null);
  });
};


// Sugar

this.get = function (endpoint, callback) {
  this.raw('GET', endpoint, callback);
};

this.post = function (endpoint, payload, callback) {
  this.raw('POST', endpoint, payload, callback);
};

this.put = function (endpoint, payload, callback) {
  this.raw('PUT', endpoint, payload, callback);
};

this.patch = function (endpoint, payload, callback) {
  this.raw('PATCH', endpoint, payload, callback);
};

this.delete = function (endpoint, callback) {
  this.raw('DELETE', endpoint, callback);
};

this.getAccount = function(accountId, callback) {
  this.getOrFail('/accounts/' + accountId, 'Could not load account.', callback);
};

this.findAccount = function(email, callback) {
  var endpoint = '/accounts?email=' + encodeURIComponent(email);
  this.getOrFail(endpoint, 'Could not load account.', callback);
};

this.getChecklists = function(callback) {
  this.getOrFail('/checklists', 'Could not load checklists.', callback);
};

this.getChecklist = function(checklistId, callback) {
  this.getOrFail('/checklists/' + checklistId, 'Could not load checklist.', callback);
};

this.getChecklistEvents = function(checklistId, callback) {
  this.getOrFail('/checklists/' + checklistId + '/events', 'Could not load checklist events.', callback);
};

this.getChecklistWebhooks = function(checklistId, callback) {
  this.getOrFail('/checklists/' + checklistId + '/webhooks', 'Could not load checklist webhooks.', callback);
};


this.createChecklist = function(title, callback) {
  var payload = parsePayload(title);

  this.put('/checklists', payload, function(err, code, data) {
    if (!err && code == 201) {
      return callback(null, data);
    }
    callback('Could not create checklist.');
  });
};

this.createItem = function(checklistId, displayText, group, position, callback) {

  // TODO: Ensure position is serialized as a number.
  var payload = {
    display_text: displayText,
    group: group || checklistId,
    position: position
  };

  this.put('/checklists/' + checklistId + '/items', payload, function(err, code, data) {
    if (!err && code == 201) {
      return callback(null, data);
    }
    callback('Could not create checklist item.');
  });
};

this.createGroup = function(checklistId, label, group, position, callback) {

  // TODO: Ensure position is serialized as a number.
  var payload = {
    label: label,
    group: group || checklistId,
    position: position
  };

  this.put('/checklists/' + checklistId + '/groups', payload, function(err, code, data) {
    if (!err && code == 201) {
      return callback(null, data);
    }
    callback('Could not create checklist group.');
  });
};

this.getOrFail = function(endpoint, errmessage, callback) {
  this.get(endpoint, function(err, code, data) {
    if (!err && code == 200) {
      return callback(null, data);
    }
    callback(errmessage);
  });
};
