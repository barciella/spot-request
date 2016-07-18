var AWS = require('aws-sdk'),
  moment = require('moment');

var ec2 = new AWS.EC2({region: 'us-west-2'});
//
// var jobs1 = [{
//   "e68c519b-64b6-4152-bfed-7c8d76391a32": {
//     "LaunchSpecification": {
//       "ImageId": "ami-7f77b31f",
//       "InstanceType": "t1.micro",
//       "KeyName": "se-devops-test",
//       "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
//     },
//     "DockerID": "hello-world",
//     "ValidFrom": "2016-07-17T20:15:00Z",
//     "idAuto": "e68c519b-64b6-4152-bfed-7c8d76391a32",
//     "SpotPrice": "0.003200",
//     "InternalStatus": "Spot Instance Requested with ValidFrom 2016-07-17T20:15:00Z",
//     "SpotInstanceRequestId": "sir-03c974dg"
//   },
//   "a906bbfe-2254-4eef-b6a9-537103b215e9": {
//     "LaunchSpecification": {
//       "ImageId": "ami-7f77b31f",
//       "InstanceType": "t1.micro",
//       "KeyName": "se-devops-test",
//       "SecurityGroups": [
//         "sorvete"
//       ],
//       "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
//     },
//     "DockerID": "hello-world",
//     "ValidFrom": "2016-07-17T20:15:00Z",
//     "idAuto": "a906bbfe-2254-4eef-b6a9-537103b215e9",
//     "SpotPrice": "0.003200"
//   },
//   "68f89b37-3fcf-4aa8-9f4d-229198e2287d": {
//     "LaunchSpecification": {
//       "ImageId": "ami-7f77b31f",
//       "InstanceType": "t1.micro",
//       "KeyName": "se-devops-test",
//       "SecurityGroupIds": [
//         "sorvete"
//       ],
//       "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
//     },
//     "DockerID": "hello-world",
//     "ValidFrom": "2016-07-17T20:15:00Z",
//     "idAuto": "68f89b37-3fcf-4aa8-9f4d-229198e2287d",
//     "SpotPrice": "0.003200"
//   },
//   "3de7d5ad-5531-49e7-b4ce-59cc6b84d4e1": {
//     "LaunchSpecification": {
//       "ImageId": "ami-7f77b31f",
//       "InstanceType": "t1.micro",
//       "KeyName": "se-devops-test",
//       "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
//     },
//     "DockerID": "hello-world",
//     "ValidFrom": "2016-07-17T20:15:00Z",
//     "idAuto": "3de7d5ad-5531-49e7-b4ce-59cc6b84d4e1",
//     "SpotPrice": "0.003200"
//   },
//   "97b29a5b-0eec-4caa-9780-c06e63e26ed7": {
//     "LaunchSpecification": {
//       "ImageId": "ami-7f77b31f",
//       "InstanceType": "t1.micro",
//       "KeyName": "se-devops-test",
//       "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
//     },
//     "DockerID": "hello-world",
//     "ValidFrom": "2016-07-17T21:15:00Z",
//     "idAuto": "97b29a5b-0eec-4caa-9780-c06e63e26ed7",
//     "SpotPrice": "0.003200",
//     "InternalStatus": "Spot Instance Requested with ValidFrom 2016-07-17T21:15:00Z",
//     "SpotInstanceRequestId": "sir-03caqpcz"
//   },
//   "42a6c3d1-3e6c-4ce7-98ef-7a268217df6f": {
//     "LaunchSpecification": {
//       "ImageId": "ami-7f77b31f",
//       "InstanceType": "t1.micro",
//       "KeyName": "se-devops-test",
//       "UserData": "I2Nsb3VkLWNvbmZpZwpyZXBvX3VwZGF0ZTogdHJ1ZQpyZXBvX3VwZ3JhZGU6IGFsbApvdXRwdXQgOiB7IGFsbCA6ICd8IHRlZSAtYSAvdmFyL2xvZy9jbG91ZC1pbml0LW91dHB1dC5sb2cnIH0KcGFja2FnZXM6CiAtIGRvY2tlcgpydW5jbWQ6CiAtIHdnZXQgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL2JhcmNpZWxsYS9zcG90LXJlcXVlc3QvbWFzdGVyL3NjcmlwdHMvdGVzdC5zaAogLSBjaG1vZCAreCB0ZXN0LnNoCiAtICguL3Rlc3Quc2ggJikgJgogLSBzZXJ2aWNlIGRvY2tlciBzdGFydAogLSBkb2NrZXIgcnVuIGhlbGxvLXdvcmxk"
//     },
//     "DockerID": "hello-world",
//     "ValidFrom": "2016-07-17T21:15:00Z",
//     "idAuto": "42a6c3d1-3e6c-4ce7-98ef-7a268217df6f",
//     "SpotPrice": "0.003200",
//     "InternalStatus": "Spot Instance Requested with ValidFrom 2016-07-17T21:15:00Z",
//     "SpotInstanceRequestId": "sir-03c8eh9p"
//   }
// }];
//
//
// jobs1.filter(function(teste) {
//   return teste == "2a6c3d1-3e6c-4ce7-98ef-7a268217df6f";
// });
//
//



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
    //console.log("eh a " + data.SpotInstanceRequests[0].Tags[0].Value);//THIS GETS THE RIGHT Value
    }

});
