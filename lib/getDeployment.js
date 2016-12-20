var env = require('../env');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'),{multiArgs:true});

module.exports = function(options) {
  return Promise.resolve().then(() => {
    var moduleName = 'getDeployment';
    var tokenpath = options.username + '/' + options.reponame + ':statusToken';
    ['username','reponame','id']
      .map(d => { if (!options[d]) throw 'Missing option in '+moduleName+': '+d; });
    if (!env.get('statusEndpoint')) throw 'Missing env in '+moduleName+': statusEndpoint';
    var token = env.get(tokenpath);
    if (!token) throw 'Missing env in '+moduleName+': '+tokenpath;
    return token;
  }).then(oauthToken => request.getAsync({
    url: env.get('statusEndpoint') + '/repos/' +
      options.username + '/' + options.reponame + '/deployments/' + options.id,
    headers: {
      Authorization: 'token ' + oauthToken,
      'User-Agent': 'deployer'
    }
  }))
  .spread((res, body) => {
    if (res.statusCode !== 200)
      throw body;
    return body.deployment;
  });
};
