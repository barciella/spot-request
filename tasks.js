var AWS = require("aws-sdk"),
	uuid = require("uuid"),
	moment = require("moment"),
	btoa = require("btoa");

function tasksController(){
	var that = this;
	var ec2 = new AWS.EC2({region: "us-west-2"});
	that.jobs = {};
	var date = moment();

	//Get all jobs
	that.get = function(req, res, next) {
		res.send(200, that.jobs);
		return next();
	};

	//post function
	that.post = function(req, res, next){
		var idAuto = uuid.v4(); //generate uuid
		that.jobs[idAuto] = req.body;
		that.jobs[idAuto].ValidFrom = req.body.ValidFrom;
		that.jobs[idAuto].idAuto = idAuto; //to be used by userdata to tag
		that.jobs[idAuto].LaunchSpecification.UserData =`#cloud-config
repo_update: true
repo_upgrade: all
output : { all : '| tee -a /var/log/cloud-init-output.log' }
packages:
 - docker
runcmd:
 - wget https://raw.githubusercontent.com/barciella/spot-request/master/scripts/test.sh
 - chmod +x test.sh
 - (./test.sh &) &
 - service docker start
 - docker run `+ req.body.DockerID + `
 - GETID="$(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
 - aws ec2 create-tags --resources $GETID --tags "Key=idAuto,Value=`+that.jobs[idAuto].idAuto + `"`
		that.jobs[idAuto].LaunchSpecification.UserData = btoa(that.jobs[idAuto].LaunchSpecification.UserData); //transform user data in base64 so aws can accept

		//get spot price for requirements and launch the request
		var paramsPrice = {
			AvailabilityZone: "us-west-2a",
			InstanceTypes: [that.jobs[idAuto].LaunchSpecification.InstanceType],
			EndTime: date.toISOString(),
			StartTime: date.subtract(15, "minutes").toISOString(),
			ProductDescriptions: ["Linux/UNIX"]
		};
		ec2.describeSpotPriceHistory(paramsPrice, function(error, data){
			if (error){
				res.send(500, "Internal Error is " + error);
				return next();
			} else {
				that.jobs[idAuto].SpotPrice = data.SpotPriceHistory[0].SpotPrice;
				//launch the Spot InstanceType request
				var params = {
					LaunchSpecification: that.jobs[idAuto].LaunchSpecification,
					SpotPrice: that.jobs[idAuto].SpotPrice,
					ValidFrom: that.jobs[idAuto].ValidFrom
				};
				ec2.requestSpotInstances(params, function(error, data){
					if (error) {
						res.send(500, "Internal Error is " + error);
					} else {
						that.jobs[idAuto].InternalStatus = "Spot Instance Requested with ValidFrom " + that.jobs[idAuto].ValidFrom;
						that.jobs[idAuto].SpotInstanceRequestId = data.SpotInstanceRequests[0].SpotInstanceRequestId;
						res.send(201, "Spot Requested is " + idAuto);
						//tag the request
						var params = {
                Resources: [that.jobs[idAuto].SpotRequest.SpotInstanceRequests[0].SpotInstanceRequestId],
                Tags: [{Key: "idAuto", Value: idAuto}]
            };
             ec2.createTags(params, function(error, data){
               if (error) {
                 res.send(500, "Internal Error is " + error);
               } else {
                 return next();
              }
             });
						}
				});
			}
		});
	};
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

	/*callback. The instance will send a post to the rest service with "instanceid" as required.
	The code will look for the tagged value, terminate the instance and write the Finished status code to the task*/

	that.callback = function(req, res, next){
		//get the autoID with the describe InstanceID
		var reqID = req.body.instanceid;
		var autoID = req.body.autoID;
		var params = {
			InstanceIds: [reqID]
		};
		//terminate the instance and write the final log on the task
			ec2.terminateInstances(params, function(error,data){
			if (error) {
				res.send(500, "Internal Error is " + error);
				} else {
					that.jobs[autoID].InternalStatus = "Job Done";
					res.send(201, "Instance " + reqID + " Terminated");
				}
			});
		}



	//Timeout gets the tagged ID of the spot-request, cancels it and then start an EC2 instance with the same parameters.
	that.timeout = function(req, res, next){
		var reqID = req.body.instanceid;
		var oJob = that.jobs[req.body.autoID];
		if (oJob){
			var params = {
				SpotInstanceRequestIds: [oJob.SpotInstanceRequestId]
			};
			ec2.cancelSpotInstanceRequests(params, function(error, data){
				if (error) {
					res.send(500, "Internal Error is " + error);
				} else {
					//launch the EC2 request, MinCount and MaxCount are needed to launch an ec2 InstanceType
					oJob.LaunchSpecification["MinCount"] = 1;
					oJob.LaunchSpecification["MaxCount"] = 1;
					ec2.runInstances(oJob.LaunchSpecification, function(error, data){
						if (error) {
							res.send(500, "Internal Error is " + error);
						} else {
							oJob.EC2InstanceID = data.Instances[0].InstanceId;
							res.send(201, "Instance ID is " + oJob.EC2InstanceID);
							oJob.InternalStatus = "EC2 Instance Running";
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
