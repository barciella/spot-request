function tasksController(){
  var that = this;
  that.jobs = [];

//Get all the jobs
  that.get = function(req, res, next){
    res.send(200, that.jobs);
    return next();
  }

//Checar qual tipo de validador pro post, exemplo de id, name por enquanto
  that.post = function(req, res, next){
    if(!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('name')){
      res.send(500);
      return next();
    }else{
      that.jobs.push({
        id: parseInt(req.body.id),
        name: req.body.name
      });
      //precisa colocar o código de start na instance aqui
      res.send(201);
    }
  };

//Get specific jobs
  var findTaskById = function(req){
    var found = that.jobs.filter(function(p){
      return p.id === parseInt(req.params.id);
    });
    if(found){
      return found[0];
    }else{
      return null;
    }
  };

  that.getById = function(req, res, next){
    var found = findTaskById(req);
    if (found){
      res.send(200, found);
    }else{
      res.send(404, "Task not found");
    }
    return next();
  }

//callback
that.callback = function(req, res, next){
  if(!req.body.hasOwnProperty('id') || !req.body.hasOwnProperty('name')){
    res.send(500);
    return next();
  }else{
    that.jobs.push({
      id: parseInt(req.body.id),
      name: req.body.name,
      status: "termine a instancia com id x"
    });
    res.send(201);
  }
};






}

module.exports = new tasksController();
