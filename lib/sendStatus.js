var env = require('../env');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'),{multiArgs:true});

module.exports = function(options) {
  return Promise.resolve();
  return Promise.resolve().then(() => {
    var moduleName = 'sendStatus';
    var tokenpath = options.username + '/' + options.reponame + ':statusToken';
    ['username','reponame','rev','state','target_url','description']
      .map(d => { if (!options[d]) throw 'Missing option in '+moduleName+': '+d; });
    if (!env.get('statusEndpoint')) throw 'Missing env in '+moduleName+': statusEndpoint';
    var token = env.get(tokenpath);
    if (!token) throw 'Missing env in '+moduleName+': '+tokenpath;
    return token;
  }).then(oauthToken => request.postAsync({
    url: env.get('statusEndpoint') + '/repos/' +
      options.username + '/' + options.reponame + '/statuses/' + options.rev,
    headers: {
      Authorization: 'token ' + oauthToken,
      'User-Agent': 'deployer'
    },
    body: {
      state: options.state,
      target_url: options.target_url,
      description: String(options.description||'').substring(0,140),
      context: 'deployer'
    },
    json: true
  }))
  .spread((res, body) => { if (res.statusCode !== 201) throw body; });
};
