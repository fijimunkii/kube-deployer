var env = require('./env');
var sendMessage = require('./lib/sendMessage');
var sendStatus = require('./lib/sendStatus');
var getDeployment = require('./lib/getDeployment');
var Promise = require('bluebird');
var request = Promise.promisifyAll(require('request'),{multiArgs:true});
var execAsync = Promise.promisify(require('child_process').exec);

module.exports = (req, res) => {
  getDeployment({
    username: req.body.repository.owner.login,
    reponame: req.body.repository.name,
    id: req.body.deployment.id
  }).then(deployment => {
    res.sendStatus(200);
    if (!(new RegExp(env.get('branch')||'.*')).test(deployment.ref))
      throw 'Invalid branch';
    var apphost = ( env.get('production') ?
      deployment.environment === 'production' && 'app' || 'stg' :
      deployment.ref ) + '.' + env.get('APPHOST');
    var cmd = [
      'export USERNAME='+req.body.repository.owner.login,
      '&& export REPONAME='+req.body.repository.name,
      '&& export APPHOST='+apphost,
      '&& export APPNAME='+env.get('APPNAME'),
      '&& export NAMESPACE='+env.get('NAMESPACE'),
      '&& export REGISTRY='+env.get('REGISTRY'),
      '&& export BRANCHNAME='+deployment.ref,
      '&& export REV='+deployment.sha,
      '&& cat app-deployment.yaml | envsubst | kubectl --kubeconfig config apply -f -'
    ].join(' ');
    console.log(cmd);
    return execAsync(cmd)
      .then(res => {
        console.log(res);
      });
  })
  .catch(err => {
    if (err === 'Invalid branch') return;
    var reason = '';
    var reasons = [
      'ENOSPC: no space left on device'
    ];
    if (reasons.indexOf(String(err && err.stack || err)) > -1)
      reason = err; 
    console.log(err && err.stack || err);
    res.status(500).end(String(err));
    return Promise.all([
      sendMessage('Deploy FAILED ' + targetUrl + ' ' + reason),
      sendStatus({
        username: req.query.username,
        reponame: req.query.reponame,
        rev: rev,
        state: 'failure',
        description: 'Deploy FAILED: ' + targetUrl + ' ' + reason,
        target_url: targetUrl
      })
    ]);
  });
};
