/*jshint node: true */

var request = require('request'),
    json    = require('JSONStream'),
    es      = require('event-stream'),
    crypto  = require('crypto'),
    baseURI = 'https://api.checklist.ninja',
    merge   = require('lodash.merge'),
    url     = require('url'),
    config  = { host: baseURI };


// prepare payloads
function parsePayload(input) {
  if (typeof input === "object") { return input; }
  var obj = { title: input };
  return obj;
}

this.config = function (config) {
  if (config) { this.config = merge(this.config,config); }
  return this.config;
};

this.sign = function (method, resource, date) {
  var parsedUrl = url.parse(resource);
  var str     = this.config.secret + '\n' + date + '\n' + method + '\n' + parsedUrl.pathname + '\n',
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
        'authorization': 'ChecklistNinja ' + this.config.pubkey +  ':' + sig,
        'date'         : date
      },
      options = { url: this.config.host + endpoint, method: method, headers: headers };

  if (arguments.length === 4) {
    options.body = JSON.stringify(payload)
  }

  request(options, function (error, response, body) {
    if (!error) {
      if (response.statusCode == 204) {
        return callback(undefined, response.statusCode, null)
      }
      return callback(undefined, response.statusCode, JSON.parse(body))
    }
    return callback(error, null, null)
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
  this.getOrFail('/accounts/' + accountId, 'Could not load account.', callback)
}

this.findAccount = function(email, callback) {
  var endpoint = '/accounts?email=' + encodeURIComponent(email)
  this.getOrFail(endpoint, 'Could not load account.', callback)
}

this.getChecklists = function(callback) {
  this.getOrFail('/checklists', 'Could not load checklists.', callback)
}

this.getChecklist = function(checklistId, callback) {
  this.getOrFail('/checklists/' + checklistId, 'Could not load checklist.', callback)
}

this.getChecklistEvents = function(checklistId, callback) {
  this.getOrFail('/checklists/' + checklistId + '/events', 'Could not load checklist events.', callback)
}

this.getChecklistWebhooks = function(checklistId, callback) {
  this.getOrFail('/checklists/' + checklistId + '/webhooks', 'Could not load checklist webhooks.', callback)
}

// TODO: Verify that the 2nd param is an array of strings.
this.createChecklist = function(title, tags, callback) {
  var payload = {
    'title': title
  }

  // If createChecklist('title', fn)
  if (arguments.length === 2) {
    callback = tags;
  } else {
    // if createChecklist('title', ['foo'], callback)
    payload.tags = tags
  }

  this.put('/checklists', payload, function(error, code, data) {
    if (!err && code == 201) {
      return callback(null, data)
    }
    callback(new Error('Could not create checklist.'))
  });
}

this.createItem = function(checklistId, displayText, parent, position, callback) {

  // TODO: Ensure position is serialized as a number.
  var payload = {
    'display_text': displayText,
    'parent': parent,
    'position': position
  }

  this.put('/checklists/' + checklistId + '/items', payload, function(error, code, data) {
    if (!err && code == 201) {
      return callback(null, data)
    }
    callback(new Error('Could not create checklist item.'))
  });
}

this.createGroup = function(checklistId, label, parent, position, callback) {

  // TODO: Ensure position is serialized as a number.
  var payload = {
    'label': label,
    'parent': parent,
    'position': position
  }

  this.put('/checklists/' + checklistId + '/groups', payload, function(error, code, data) {
    if (!err && code == 201) {
      return callback(null, data)
    }
    callback(new Error('Could not create checklist group.'))
  });
}

this.getOrFail = function(endpoint, message, callback) {
  this.get(endpoint, function(err, code, data) {
    if (!err && code == 200) {
      return callback(null, data)
    }
    callback(new Error(message))
  });
}
