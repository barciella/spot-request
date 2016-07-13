
var AWS = require('aws-sdk'),
  uuid = require('uuid');

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
    var lastSpotInstanceRequestId = that.lastSpotInstanceRequestId;
    idAuto = uuid.v4();
    that.jobs[idAuto] = {};
    that.jobs[idAuto].params = req.body.paramsEnv;
    //that.jobs[idAuto].teste = new Date();


    var params = {
      launchSpecification: that.jobs[idAuto].params,
      SpotPrice: "0.002",
      ValidUntil: new Date
    }
    //Start Spot Instance - This works
    ec2.requestSpotInstances(params, function(err, data){
      if (error) {
        console.log(err);
      } else {
        console.log(data);
        //console.log(data.SpotInstanceRequests[0].SpotInstanceRequestId);
        //lastSpotInstanceRequestId.push(data.SpotInstanceRequests[0].SpotInstanceRequestId);
        //console.log(lastSpotInstanceRequestId);
        //that.spotInstancesIds[ data.SpotInstanceRequests[0].SpotInstanceRequestId ].uuid = idAuto;
        //that.spotInstancesIds[ data.SpotInstanceRequests[0].SpotInstanceRequestId ].startDate = new Date();
        //that.jobs[idAuto].SpotInstanceRequests = data.SpotInstanceRequests;
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
