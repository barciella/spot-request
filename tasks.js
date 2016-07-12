
var AWS = require('aws-sdk'),
  uuid = require('uuid');

function tasksController(){
  var that = this;
  var ec2 = new AWS.EC2({region: 'sa-east-1'});
  that.jobs = [];

//Get all the jobs
  that.get = function(req, res, next){
    res.send(200, that.jobs);
    return next();
  }

//Post a new job. It will auto generate an ID, start the spot request and
//schedule a Cron job to see if the spot request is fullfilled 15 minutes
//after the schedule spot request
  that.post = function(req, res, next){
    if(!req.body.hasOwnProperty('params')){
      res.send(500);
      return next();
    }else{
//checar isso aqui
      var idAuto = uuid.v4();
      that.jobs.push({
        id: idAuto,
        params: req.body.params,
        userData: req.body.userData
      });
      //Start Spot Instance - This works
      ec2.requestSpotInstances(req.body.params, function (error, data){
        if (error) {
          console.log(error);
        }else{
          console.log(data);
        }
      });
      //ec2.describeSpotPriceHistory(params, function(error, data){
      //  if (error) {
      //    console.log(error);
      //  }else {
      //    console.log(data);
      //  }
      //});
      res.send(201);

    }
  };

//Get specific jobs
  var findTaskById = function(req){
    var found = that.jobs.filter(function(p){
      return p.id === req.params.id;
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
  var found = findTaskById(req);
  if (found){
    res.send(200, found);
    that.jobs[found].push({
    status: "termine a instancia com id x"
    });
    res.send(201);
  }
};






}

module.exports = new tasksController();
