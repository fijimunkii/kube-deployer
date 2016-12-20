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
    console.log([
      'BRANCHNAME='+deployment.ref,
      'REV='+deployment.sha,
      'cat app-deployment.yaml | kubectl --kubeconfig config'
    ].join(' '));
    return execAsync([
      'BRANCHNAME='+deployment.ref,
      'REV='+deployment.sha,
      'cat app-deployment.yaml | kubectl --kubeconfig config'
    ].join(' ')).then(res => {
      console.log(res);
    });
  })
  .catch(err => {
    var reason = '';
    var reasons = [
      'ENOSPC: no space left on device'
    ];
    if (reasons.indexOf(String(err && err.stack || err)) > -1)
      reason = err; 
    console.log(err && err.stack || err);
    res.end(String(err));
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
