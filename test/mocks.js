this.raw = function(method, endpoint, payload, callback) {
        if (arguments.length === 3) {
          callback = payload;
        }
        callback(null, 200, {method: method, endpoint: endpoint, payload: payload });
      };


this.put = function (endpoint, payload, callback) {
      if (payload.title === 'failcode') return callback(undefined, 200, null);
      return callback(undefined, 201, {endpoint: endpoint, payload: payload });
    };

this.get = function (endpoint, callback) {
      if (endpoint === '/failerr')  return callback("Error msg", 200, null);
      if (endpoint === '/failcode') return callback(undefined, 404, "Not found");
      return callback(undefined, 200, endpoint);
    };