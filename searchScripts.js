var AWS = require("aws-sdk"),
	http = require("http")
	moment = require("moment");

var ec2 = new AWS.EC2({region: "us-west-2"});
	var params =
	{
		Filters:
		[
			{
				Name: "type",
				Values: ["one-time"]
			},
			{
				Name: "state",
				Values: ["open"]
			}
		]
	};
ec2.describeSpotInstanceRequests(params, function(error,data){
	if (error){
		console.log(error);
	} else {
		console.log(data);
		var date = new moment();
		for (var i = 0; i < data.SpotInstanceRequests.length; i++){
			//this is where you can choose to change how long the spot request could be open before cancelling and adding ec2. Right now is 15 minutes after ValidFrom
			if (moment(data.SpotInstanceRequests[i].ValidFrom).add(15, "minutes").isBefore(date) ){
				var tag = data.SpotInstanceRequests[i].Tags[0].Value;
				//send the post to server to cancel the request for spot and launch ec2
				var bodyString = [{
					"autoId": tag
				}];

				var headers = {
					"Content-Type": "application/json",
					"Content-Length": bodyString.length
				};
				var options = {
					host: "http://179.99.217.141",
					path: "/v1/tasks/timeout",
					port: 4000,
					method: "POST",
					headers: headers
				};
				var callback = function(response) {
					var str = " ";
					response.on("data", function(chunk) {
						str += chunk;
					});
					response.on("end", function() {
						console.log(str);
					});
				};
				http.request(options, callback).write(bodyString);
			}
		}
	}
});
