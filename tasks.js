
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

//post function
  that.post = function(req, res, next){
    idAuto = uuid.v4(); //generate uuid
    that.jobs[idAuto] = {};
    that.jobs[idAuto] = req.body;
    console.log(that.jobs[idAuto]);
    that.jobs[idAuto].LaunchSpecification.UserData = `#cloud-config
repo_update: true
repo_upgrade: all

packages:
 - httpd24
 - php56
 - mysql55
 - server
 - php56-mysqlnd

runcmd:
 - service httpd start
 - chkconfig httpd on
 - groupadd www
 - [ sh, -c, "usermod -a -G www ec2-user" ]
 - [ sh, -c, "chown -R root:www /var/www" ]
 - chmod 2775 /var/www
 - [ find, /var/www, -type, d, -exec, chmod, 2775, {}, + ]
 - [ find, /var/www, -type, f, -exec, chmod, 0664, {}, + ]
 - [ sh, -c, 'echo "<?php phpinfo(); ?>" > /var/www/html/phpinfo.php' ]` //+ req.body.DockerID; //auto test, jesus christ it works. req.
    that.jobs[idAuto].LaunchSpecification.UserData = btoa(that.jobs[idAuto].LaunchSpecification.UserData); //transform user data in base64 so aws can accept

    //get spot price for instance_id and use that price to launch the ec2
    var paramsPrice = {
      AvailabilityZone: "us-west-2a",
      InstanceTypes: [that.jobs[idAuto].LaunchSpecification.InstanceType],
      EndTime: date.toISOString(),
      StartTime: date.subtract(15, "minutes").toISOString(),
      ProductDescriptions: ["Linux/UNIX"]
    }
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
             //tag the instance with generated autoid
             var params = {
                Resources: [that.jobs[idAuto].SpotRequest.SpotInstanceRequests[0].SpotInstanceRequestId],
                Tags: [{Key: "idAuto", Value: idAuto}]
            }
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
    res.send(201);
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
  }

  //callback not done yet
  that.callback = function(req, res, next){
    var oJob = that.jobs[req.params.id];
    if (oJob){
      var params = {
        InstanceIds: oJob
      }
        ec2.terminateInstances = (params, function(error,data){
          if (error) {
            return (error);
          } else {
            return (data);
          }
        });
    res.send(201, "Instance " + oJob + " Terminated");
    }else{
    send(404, "Job Not Found");
    };
  }


  //timeout. To be called when the request isn't fullfiled in 15 minutes, then it start an ec2 instance and tags it
  that.timeout = function(req, res, next){
    var oJob = that.jobs[req.params.id];
    if (oJob){
      //cancel the spot request
      var params = {
        SpotInstanceRequestIds: [oJob.SpotRequest.SpotInstanceRequests[0].SpotInstanceRequestId]
      }
      ec2.cancelSpotInstanceRequests(params, function(error, data){
        if (error) {
          console.log(error);
          res.send(404, "Job Not Found");
        } else {
          console.log(data);
        }
      });
          //oJob.LaunchSpecification + {"MinCount: 1"}, {"MaxCount: 2"};
          //launch the Ec2 request
          //  var params = {
          //     MinCount: 1,
          //     MaxCount: 1}

            // ec2.runInstances(oJob.LaunchSpecification + params, function(error, data){
            //  if (error) {
            //    console.log(error);
            //  } else {
            //    console.log(data);
            //    oJob.InstanceInfo = data;
               //tag the instance with generated autoid
              //  var params = {
              //     Resources: [that.jobs[idAuto].SpotRequest.SpotInstanceRequests[0].SpotInstanceRequestId],
              //     Tags: [{Key: "idAuto", Value: idAuto}]
              // }
              //  ec2.createTags(params, function(error, data){
              //    if (error) {
              //      console.log(error);
              //    } else {
              //      console.log(data);
              //   }
              //  });
          //   }
          // });
          }
        }
}

module.exports = new tasksController();
