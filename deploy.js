var env = require('./env');
var sendMessage = require('./lib/sendMessage');
var sendStatus = require('./lib/sendStatus');
var deploySync = {};

module.exports = (req, res) => {
  console.log('query',req.query);
  console.log('params',req.params);
  /*
  var key, branchname, releaseBranch, logdir, logfiles, targetUrl, rev, server, keepAliveInterval, dockerTag;
  return Promise.resolve().then(() => {
    branchname = (req.query.branchname || releaseBranch).replace(/([^\w\d\s-])/,''); 
    server = req.query.server && decodeURIComponent(req.query.server);
    var servers = env.get(req.query.username+'/'+req.query.reponame+':servers');
    if (req.query.prod && branchname === releaseBranch)
      server = server || servers.prod[0];
    else if (branchname === releaseBranch)
      server = server || servers.stg[0]; 
    else
      server = server || branchname + servers.dev[0];
    key = [req.query.username,req.query.reponame,branchname,server].join('/');
    logdir = require('path').join('/home/ubuntu/logs/deployer/', key);
    logfiles = env.get('LOG_FILES') || ['deploy.log'];
    targetUrl = 'https://'+server;
    res.write('<html><head>');
    res.write('<body>');
    res.write('<script>document.title="Deploying - '+key+'";</script>');
    if (deploySync[key])
      throw 'DEPLOY_ALREADY_RUNNING';
    deploySync[key] = true;
    ['username','reponame'].forEach(d => {
      if (!req.query[d])
        throw 'Missing query parameter: ' + d;
    }); 
    if (req.query.quick)
      res.end('OK');

    rev = req.query.sha;
    dockerTag = req.query.username+'/'+req.query.reponame+'-selenium:'+branchname+'-'+rev;
    return sendStatus({
      username: req.query.username,
      reponame: req.query.reponame,
      rev: rev,
      state: 'pending',
      description: 'Deploying ' + targetUrl,
      target_url: targetUrl
    })
    .then(() => deploy({
      project: req.query.username + '-' + req.query.reponame,
      artifacts: artifact.url,
      rev: artifact.sha,
      dockerTag: dockerTag,
      server: server,
      NODE_ENV: (branchname === releaseBranch) ? 'production' : 'development',
      req: req,
      res: res,
      logdir: logdir,
      logfiles: logfiles,
      targetUrl: targetUrl,
      extraTests: extraTests
    }));
  })
  .then(() => {
    res.write('<script>document.title=String.fromCharCode("9989")+" '+key+'";</script>');
    res.end('OK');
  })
  .then(() => sendStatus({
    username: req.query.username,
    reponame: req.query.reponame,
    rev: rev,
    state: 'success',
    description: 'Deployed '+server,
    target_url: targetUrl
  }))
  .then(() => sendMessage('Deployed ' + server))
  .then(() => { delete deploySync[key]; })
  .catch(err => {
    var reason = '';
    var reasons = [
      'REV_CHECK_FAILED',
      'TEST_ALREADY_RUNNING',
      'Failed to find successful build',
      'ENOSPC: no space left on device',
      'UnexpectedAlertOpen'
    ];
    if (reasons.indexOf(String(err && err.stack || err)) > -1)
      reason = err; 
    console.log(err && err.stack || err);
    if (err !== 'DEPLOY_ALREADY_RUNNING')
      delete deploySync[key];
    res.write('<script>document.title=String.fromCharCode("10008")+" '+key+'";</script>');
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
  */
};
