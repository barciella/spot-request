
var AWS = require('aws-sdk'),
  uuid = require('uuid'),
  btoa = require('btoa');

function tasksController(){
  var that = this;
  var ec2 = new AWS.EC2({region: 'sa-east-1'});
  that.jobs = {};
  that.spotInstancesIds = {};

  //that.lastSpotInstanceRequestId = [];

//Get all jobs
  that.get = function(req, res, next) {
    res.send(200, that.jobs);
    return next();
  }

  that.post = function(req, res, next){
    idAuto = uuid.v4();
    that.jobs[idAuto] = {};
    that.jobs[idAuto].LaunchSpecification = req.body.paramsEnv;
    that.jobs[idAuto].dados = req.body.UserData;
  //  console.log(req.body.UserData);
    that.jobs[idAuto].base64 = btoa(req.body.UserData);
    console.log(that.jobs[idAuto].base64);
    //that.jobs[idAuto].teste = new Date();

    var params = {
      LaunchSpecification: that.jobs[idAuto].LaunchSpecification,
      UserData: toString(that.jobs[idAuto].base64),
      SpotPrice: "0.002",
    };

    ec2.requestSpotInstances(params, function(error, data){
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        that.jobs[idAuto].SpotInstanceRequests = data.SpotInstanceRequests;
      }
    });
    res.send(201);
  };

  //Get specific jobs
  that.getById = function(req, res, next){
    var oJob = that.jobs[ req.params.id ];
    if ( oJob ) {
      res.send(200, oJob);
    } else {
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
