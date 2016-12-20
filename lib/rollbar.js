var useRollbar = false;
var env = require('../env');
var rollbar = require('rollbar');

if (useRollbar)
  rollbar.init(env.get('rollbar_token'), {
    environment: env.get('NODE_ENV') || 'production'
  });

module.exports = {
  useRollbar: useRollbar,
  rollbar: rollbar
};
