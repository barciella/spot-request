var restify = require("restify"),
	tasks = require("./tasks"),
	port = process.env.PORT || 4000;

var server = restify.createServer({
	name: "Restify Server"
});

server.use(function(req, res, next){
	console.log(req.method + " " + req.url);
	return next();
});

server.use(restify.bodyParser());

server.get("v1/tasks", tasks.get);
server.get("v1/tasks/:id", tasks.getById);
server.post("v1/tasks", tasks.post);
server.post("v1/tasks/callback", tasks.callback);
server.post("v1/tasks/timeout", tasks.timeout);


server.listen(port, function(){
	console.log("api running at " + port);
});
