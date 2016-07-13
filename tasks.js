
var AWS = require('aws-sdk'),
  uuid = require('uuid');

function tasksController(){
  var that = this;
  var ec2 = new AWS.EC2({region: 'sa-east-1'});
  that.jobs = {};
  that.spotInstancesIds = {};

  that.lastSpotInstanceRequestId = [];

//Get all jobs
  that.get = function(req, res, next) {
    res.send(200, that.jobs);
    return next();
  }

  that.post = function(req, res, next){
    var lastSpotInstanceRequestId = that.lastSpotInstanceRequestId;
    idAuto = uuid.v4();
    that.jobs[idAuto] = {};
    that.jobs[idAuto].params = req.body.paramsEnv;
    that.jobs[idAuto].teste = new Date();

    //Start Spot Instance - This works
    ec2.requestSpotInstances(that.jobs[idAuto].params, function(error, data){
      if (error) {
        console.log(error);
      } else {
        console.log(data);
        console.log(data.SpotInstanceRequests[0].SpotInstanceRequestId);
        lastSpotInstanceRequestId.push(data.SpotInstanceRequests[0].SpotInstanceRequestId);
        console.log(lastSpotInstanceRequestId);
        //that.spotInstancesIds[ data.SpotInstanceRequests[0].SpotInstanceRequestId ].uuid = idAuto;
        //that.spotInstancesIds[ data.SpotInstanceRequests[0].SpotInstanceRequestId ].startDate = new Date();
        //that.jobs[idAuto].SpotInstanceRequests = data.SpotInstanceRequests;
      }
    });

    var params = {
      SpotInstanceRequestIds: lastSpotInstanceRequestId,
      DryRun: false
    };
    console.log(params);
    ec2.cancelSpotInstanceRequests( params, function(error, data){
      if (error) {
        console.log(error);
      }else{
        console.log(data);
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
