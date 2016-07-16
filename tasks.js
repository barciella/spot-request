
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
  };

//post function
  that.post = function(req, res, next){
    idAuto = uuid.v4(); //generate uuid
    that.jobs[idAuto] = {};
    that.jobs[idAuto] = req.body;
    that.jobs[idAuto].idAuto = idAuto; //to be used by the timeout and callback function
    that.jobs[idAuto].LaunchSpecification.UserData = `#cloud-config
    output:
      all: "| tee -a /var/log/cloud-init-output.log"
    repo_update: true
    repo_upgrade: all
    packages:
      - docker

      runcmd:
      - "touch /home/ec2-user/beforeDockerStart"
      - "service docker start"
      - "docker run" `+ req.body.DockerID;//can do + req.body.DockerID later; //auto test, jesus christ it works.
    that.jobs[idAuto].LaunchSpecification.UserData = btoa(that.jobs[idAuto].LaunchSpecification.UserData); //transform user data in base64 so aws can accept

    //get spot price for instance_id and use that price to launch the ec2
    var paramsPrice = {
      AvailabilityZone: "us-west-2a",
      InstanceTypes: [that.jobs[idAuto].LaunchSpecification.InstanceType],
      EndTime: date.toISOString(),
      StartTime: date.subtract(15, "minutes").toISOString(),
      ProductDescriptions: ["Linux/UNIX"]
    };
    ec2.describeSpotPriceHistory(paramsPrice, function(error, data){
      if(error){
        console.log(error);
      } else {
        console.log(data);
        that.jobs[idAuto].SpotPrice = data.SpotPriceHistory[0].SpotPrice;
        //launch the Spot InstanceType request
         var params = {
           LaunchSpecification: that.jobs[idAuto].LaunchSpecification,
           SpotPrice: that.jobs[idAuto].SpotPrice
           };
          ec2.requestSpotInstances(params, function(error, data){
           if (error) {
             console.log(error);
           } else {
             console.log(data);
             that.jobs[idAuto].SpotRequest = data;
             that.jobs[idAuto].InternalStatus = "SpotInstanceRequested";
             res.send(201, "Spot Requests with ID: " + idAuto);
             //tag the instance with generated autoid
             var params = {
                Resources: [that.jobs[idAuto].SpotRequest.SpotInstanceRequests[0].SpotInstanceRequestId],
                Tags: [{Key: "idAuto", Value: idAuto}]
            };
             ec2.createTags(params, function(error, data){
               if (error) {
                 console.log(error);
               } else {
                 console.log(data);
              }
             });
          }
       });
      }
    });

}
  //Get specific jobs
  that.getById = function(req, res, next){
    var oJob = that.jobs[req.params.id];
    if (oJob) {
      res.send(200, oJob);
    }else{
      res.send(404, "Job Not Found");
    }
    return next();
  };

  //callback not done yet
  that.callback = function(req, res, next){
    var oJob = that.jobs[req.params.id];
    console.log(oJob.InstanceID);
    if (oJob){
      //terminate the instance
      var params = {
        InstanceIds: [oJob.InstanceID]
      };
      ec2.terminateInstances(params, function(error,data){
          if (error) {
            console.log(error);
            res.send(500, "couldnt terminate it");
          } else {
            console.log(data);
            oJob.InternalStatus = "Job Done";
            res.send(201, "Instance " + oJob.InstanceID + " Terminated");
          }
        });

    }else{
    res.send(404, "Job Not Found");
    }
  };

  //Timeout gets the tagged ID of the spot-request, cancels it and then start an EC2 instance with the same parameters.
  that.timeout = function(req, res, next){
   var oJob = that.jobs[req.params.id];
   if (oJob){
     //cancel the spot request
     var params = {
       SpotInstanceRequestIds: [oJob.SpotRequest.SpotInstanceRequests[0].SpotInstanceRequestId]
     };
     ec2.cancelSpotInstanceRequests(params, function(error, data){
       if (error) {
         console.log(error);

       } else {
         console.log(data);
         //launch the EC2 request, MinCount and MaxCount are needed to launch an ec2 InstanceType
         oJob.LaunchSpecification["MinCount"] = 1;
         oJob.LaunchSpecification["MaxCount"] = 1;
         ec2.runInstances(oJob.LaunchSpecification, function(error, data){
           if (error) {
             console.log(error);
           } else {
             console.log(data);
             oJob.InstanceID = data.Instances[0].InstanceId;
             res.send(201, "Instance ID is " + oJob.InstanceID);
             oJob.InternalStatus = "EC2 Instance Running";
             //tags the Instance
             var params = {
                  Resources: [oJob.InstanceID],
                  Tags: [{Key: "idAuto", Value: oJob.idAuto}]
              };
               ec2.createTags(params, function(error, data){
                 if (error) {
                   console.log(error);
                 } else {
                   console.log(data);
                   return next(); //checar isso aqui
                }
              });
           }
         });
       }
     });

   } else {
     res.send(404, "Job not Found");
     return (next);
   }
 };
}

module.exports = new tasksController();
