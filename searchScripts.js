var AWS = require("aws-sdk"),
	moment = require("moment");

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
setInterval(function(){
	ec2.describeSpotInstanceRequests(params, function(error,data){
		if (error){
			console.log(error);
		} else {
			console.log(data);
			var date = new moment();
			for (var i = 0; i < data.SpotInstanceRequests.length; i++){
				if (moment(data.SpotInstanceRequests[i].ValidFrom).add(15, "minutes").isBefore(date) ){
					var tag = data.SpotInstanceRequests[i].Tags[0].Value;
					console.log(tag);

				}
			}

		}

	});
},900000);
