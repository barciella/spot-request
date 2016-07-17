var AWS = require('aws-sdk'),
  moment = require('moment');

var ec2 = new AWS.EC2({region: 'us-west-2'});

var jobs1 = {

  "21fc4615-f590-411d-8436-685442119f5b": {
    "LaunchSpecification": {
      "ImageId": "ami-7f77b31f",
      "InstanceType": "t1.micro",
      "KeyName": "se-devops-test",
      "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
    },
    "DockerID": "hello-world",
    "ValidFrom": "2016-07-17T14:40:00Z",
    "idAuto": "21fc4615-f590-411d-8436-685442119f5b",
    "SpotPrice": "0.003200",
    "SpotRequest": {
      "SpotInstanceRequests": [
        {
          "SpotInstanceRequestId": "sir-03c5lfzj",
          "SpotPrice": "0.003200",
          "Type": "one-time",
          "State": "open",
          "Status": {
            "Code": "not-scheduled-yet",
            "UpdateTime": "2016-07-17T14:35:46.000Z",
            "Message": "Your Spot request will not be evaluated until 2016-07-17T14:40:00+0000 due to your 'Valid From' constraint."
          },
          "ValidFrom": "2016-07-17T14:40:00.000Z",
          "LaunchSpecification": {
            "ImageId": "ami-7f77b31f",
            "KeyName": "se-devops-test",
            "SecurityGroups": [
              {
                "GroupName": "default",
                "GroupId": "sg-0c8ea569"
              }
            ],
            "InstanceType": "t1.micro",
            "Placement": {
              "AvailabilityZone": "us-west-2c"
            },
            "BlockDeviceMappings": [],
            "SubnetId": "subnet-0b15d752",
            "NetworkInterfaces": [],
            "Monitoring": {
              "Enabled": false
            }
          },
          "CreateTime": "2016-07-17T14:35:46.000Z",
          "ProductDescription": "Linux/UNIX",
          "Tags": []
        }
      ]
    },
    "InternalStatus": "SpotInstanceRequested"
  },
  "7585f88e-b0a7-4bdc-896e-62a67e9d4f29": {
    "LaunchSpecification": {
      "ImageId": "ami-7f77b31f",
      "InstanceType": "t1.micro",
      "KeyName": "se-devops-test",
      "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
    },
    "DockerID": "hello-world",
    "ValidFrom": "2016-07-17T14:40:00Z",
    "idAuto": "7585f88e-b0a7-4bdc-896e-62a67e9d4f29",
    "SpotPrice": "0.003200",
    "SpotRequest": {
      "SpotInstanceRequests": [
        {
          "SpotInstanceRequestId": "sir-03c5g2jg",
          "SpotPrice": "0.003200",
          "Type": "one-time",
          "State": "open",
          "Status": {
            "Code": "not-scheduled-yet",
            "UpdateTime": "2016-07-17T14:36:08.000Z",
            "Message": "Your Spot request will not be evaluated until 2016-07-17T14:40:00+0000 due to your 'Valid From' constraint."
          },
          "ValidFrom": "2016-07-17T14:40:00.000Z",
          "LaunchSpecification": {
            "ImageId": "ami-7f77b31f",
            "KeyName": "se-devops-test",
            "SecurityGroups": [
              {
                "GroupName": "default",
                "GroupId": "sg-0c8ea569"
              }
            ],
            "InstanceType": "t1.micro",
            "Placement": {
              "AvailabilityZone": "us-west-2c"
            },
            "BlockDeviceMappings": [],
            "SubnetId": "subnet-0b15d752",
            "NetworkInterfaces": [],
            "Monitoring": {
              "Enabled": false
            }
          },
          "CreateTime": "2016-07-17T14:36:07.000Z",
          "ProductDescription": "Linux/UNIX",
          "Tags": []
        }
      ]
    },
    "InternalStatus": "SpotInstanceRequested"
  }


}




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
    // for(var name in jobs1) {
    //   console.log(name);
    //   var value = jobs1[name];
    //   console.log(value);
    //}

  }
});
