
var AWS = require('aws-sdk'),
  uuid = require('uuid'),
  moment = require('moment'),
  btoa = require('btoa');

function tasksController(){
  var that = this;
  var ec2 = new AWS.EC2({region: 'sa-east-1'});
  that.jobs = {};
  var date = moment();

  //Get all jobs
  that.get = function(req, res, next) {
    res.send(200, that.jobs);
    return next();
  }

  that.post = function(req, res, next){
    idAuto = uuid.v4(); //generate uuid
    that.jobs[idAuto] = {};
    that.jobs[idAuto].LaunchSpecification = req.body.paramsEnv; //get paramsEnv from Json
    that.jobs[idAuto].LaunchSpecification.UserData = btoa(that.jobs[idAuto].LaunchSpecification.UserData); //transform user data in base64 so aws can accept

    //get spot price for instance_id
    var paramsPrice = {
      AvailabilityZone: "sa-east-1a",
      InstanceTypes: [that.jobs[idAuto].LaunchSpecification.InstanceType],
      EndTime: date.toISOString(date),
      StartTime: date.toISOString(date.subtract(7, "days")),
      ProductDescriptions: ["Linux/Unix"]
    }
    ec2.describeSpotPriceHistory(paramsPrice, function(error, data){
      if(error){
        console.log(error);
        console.log(paramsPrice);
      } else {
        console.log(data);
      }
    });

    //launch the Spot InstanceType
  //  var params = {
    //  LaunchSpecification: that.jobs[idAuto].LaunchSpecification,
      //comment so it can crash //SpotPrice: "0.002",
      //ProductDescription: "Linux/Unix"
    //};


  //  ec2.requestSpotInstances(params, function(error, data){
  //    if (error) {
//        console.log(error);
//      } else {
//        that.jobs[idAuto].SpotInstanceRequests = data.SpotInstanceRequests;
//    });
//    res.send(201);
//  };
}
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
