var AWS = require("aws-sdk"),
	http = require("http")
	moment = require("moment");

function searchScript(){
	setInterval(function(){
			var ec2 = new AWS.EC2({region: "us-west-2"});

		var params = {
			Filters: [
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
					if (moment(data.SpotInstanceRequests[i].ValidFrom).add(15, "minutes").isBefore(date) ){
						var tag = data.SpotInstanceRequests[i].Tags[0].Value;
						//send the post to server
						var bodyString = {
							"id": tag
						};

						var headers = {
							"Content-Type": "application/json",
							"Content-Length": bodystring.length
						};
						var options = {
							host: "localhost",
							path: "/v1/tasks/timeout",
							port: 4000,
							method: "POST",
							headers: headers
						};

						var callback = function(response) {
							var str = " ";

							//another chunk of data has been recieved, so append it to `str`
							response.on("data", function(chunk) {
								str += chunk;
							});

							//the whole response has been recieved, so we just print it out here
							response.on("end", function() {
								console.log(str);
							});
						};
						http.request(options, callback).write(bodyString);
					}
				}

			}

		});
	},900000);
}

module.exports = new searchScript();
