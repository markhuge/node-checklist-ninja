this.raw = function(method, endpoint, payload, callback) {
  if (arguments.length === 3) {
    callback = payload;
  }
  switch(method) {
    case 'PUT':
      callback(null, 201, {method: method, endpoint: endpoint, payload: payload });
      break;
    case 'PATCH':
    case 'POST':
    case 'DELETE':
      callback(null, 204, {method: method, endpoint: endpoint, payload: payload });
      break;
    default:
      callback(null, 200, {method: method, endpoint: endpoint, payload: payload });
  }
};


this.put = function (endpoint, payload, callback) {
  if (payload.title === 'failcode' || payload.display_text === 'failcode' || payload.label === 'failcode') {
    return callback(undefined, 500, null);
  }
  return callback(undefined, 201, {endpoint: endpoint, payload: payload });
};

this.post = function (endpoint, payload, callback) {
  if (payload.title === 'failcode' || payload.display_text === 'failcode' || payload.label === 'failcode') {
    return callback(undefined, 500, null);
  }
  return callback(undefined, 204, {endpoint: endpoint, payload: payload });
};

this.get = function (endpoint, callback) {
  if (endpoint === '/failerr')  return callback("Error msg", 200, null);
  if (endpoint === '/failcode') return callback(undefined, 404, "Not found");
  return callback(undefined, 200, endpoint);
};

this.request = function (options, callback) {
  if (options.err === true) return callback("Error as expected");
  if (options.code) return callback(undefined, {statusCode: options.code}, options);
  return callback(undefined, 200, options);
};
