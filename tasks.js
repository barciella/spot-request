
var AWS = require('aws-sdk'),
  uuid = require('uuid'),
  moment = require('moment'),
  btoa = require('btoa');

function tasksController(){
  var that = this;
  var ec2 = new AWS.EC2({region: 'us-west-2'});
  that.jobs = {};
  var date = moment();
  var price = "";
  //Get all jobs
  that.get = function(req, res, next) {
    res.send(200, that.jobs);
    return next();
  }

  that.post = function(req, res, next){
    idAuto = uuid.v4(); //generate uuid
    that.jobs[idAuto] = {};
    that.jobs[idAuto].LaunchSpecification = req.body.paramsEnv; //get paramsEnv from Json
    that.jobs[idAuto].LaunchSpecification.UserData = "I2Nsb3VkLWNvbmZpZw0KcmVwb191cGRhdGU6IHRydWUNCnJlcG9fdXBncmFkZTogYWxsDQoNCnBhY2thZ2VzOg0KIC0gaHR0cGQyNA0KIC0gcGhwNTYNCiAtIG15c3FsNTUNCiAtIHNlcnZlcg0KIC0gcGhwNTYtbXlzcWxuZA0KDQpydW5jbWQ6DQogLSBzZXJ2aWNlIGh0dHBkIHN0YXJ0DQogLSBjaGtjb25maWcgaHR0cGQgb24NCiAtIGdyb3VwYWRkIHd3dw0KIC0gWyBzaCwgLWMsICJ1c2VybW9kIC1hIC1HIHd3dyBlYzItdXNlciIgXQ0KIC0gWyBzaCwgLWMsICJjaG93biAtUiByb290Ond3dyAvdmFyL3d3dyIgXQ0KIC0gY2htb2QgMjc3NSAvdmFyL3d3dw0KIC0gWyBmaW5kLCAvdmFyL3d3dywgLXR5cGUsIGQsIC1leGVjLCBjaG1vZCwgMjc3NSwge30sICsgXQ0KIC0gWyBmaW5kLCAvdmFyL3d3dywgLXR5cGUsIGYsIC1leGVjLCBjaG1vZCwgMDY2NCwge30sICsgXQ0KIC0gWyBzaCwgLWMsICdlY2hvICI8P3BocCBwaHBpbmZvKCk7ID8+IiA+IC92YXIvd3d3L2h0bWwvcGhwaW5mby5waHAnIF0="; //auto test
    //that.jobs[idAuto].LaunchSpecification.UserData = btoa(that.jobs[idAuto].LaunchSpecification.UserData); //transform user data in base64 so aws can accept

    //get spot price for instance_id
    var paramsPrice = {
      AvailabilityZone: "us-west-2a",
      InstanceTypes: [that.jobs[idAuto].LaunchSpecification.InstanceType],
      EndTime: date.toISOString(),
      StartTime: date.toISOString(date.subtract(15, "minutes")),
      ProductDescriptions: ["Linux/UNIX"]
    }
    ec2.describeSpotPriceHistory(paramsPrice, function(error, data){
      if(error){
        console.log(error);
      } else {
        console.log(data);
        that.jobs[idAuto].SpotPrice = data.SpotPriceHistory[0].SpotPrice;
        console.log("preco eh" + price1);
        // price1(data.SpotPriceHistory.SpotPrice);
        // price = data.SpotPriceHistory.SpotPrice;
        // // return price;

      }
    });

    //launch the Spot InstanceType
   var params = {
     LaunchSpecification: that.jobs[idAuto].LaunchSpecification,
     SpotPrice: that.jobs[idAuto].SpotPrice
     };


   ec2.requestSpotInstances(params, function(error, data){
     if (error) {
       console.log(error);
     } else {
       console.log(data);
       //that.jobs[idAuto].SpotInstanceRequests = data.SpotInstanceRequests;
   }
   res.send(201);
 });
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
