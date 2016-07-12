var restify = require('restify'),
  tasks = require('./tasks'),
  AWS = require('aws-sdk'),
  uuid = require('uuid'),
  port = process.env.PORT || 4000;

  var server = restify.createServer({
    name: 'Restify Server'
  });

server.use(function(req, res, next){
  console.log(req.method + ' ' + req.url);
  return next();
});

server.use(restify.bodyParser());

server.get('v1/tasks', tasks.get);
server.get('v1/tasks/:id', tasks.getById);
server.post('v1/tasks', tasks.post);
server.put('v1/tasks/:id/callback', tasks.callback);

server.listen(port, function(){
  console.log('api running at ' + port);
});
