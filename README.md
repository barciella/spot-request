## Synopsis

This is a RESTFUL service that launch spot-requests in AWS based on region and InstanceType to get the latest bid price and launch a request with that bid. The instance will run the provided docker image. It will automatically call this service to terminate the instance once the docker job finishes. If the spot-instance is marked for termination it will call this service to create an EC2 job with the same parameters.

## Installation
You will have to configure the server address on the following files:
./scripts/test.sh on lines 5 and 11
./searchScript.js on line 40

You have to install [node](https://nodejs.org/en/) and run "npm install" and then "npm start".

The script ./searchScript.js is used to check open spot-instance requests that have not being fulfilled 15 minutes after being opened. It will cancel the spot-instance requests and send a call to this service to start an ec2 instance. Depending on your needs you can change this attributes, schedule it on cron etc.

## API Reference

GET: http://localhost:4000/v1/tasks
  Gets a list of all the tasks.

GET: http://localhost:4000/v1/:id
  Get the contents of an specific task.

POST: http://localhost:4000/v1/tasks
Required:
    {
    "LaunchSpecification":
    {
      "ImageId": "ami-7f77b31f",
      "InstanceType": "t1.micro",
    },
    "DockerID": "hello-world",
    "ValidFrom": "2016-07-20T02:08:00Z"
    }
Response: (201, "Spot Requested is idAuto")
Info: It will accept anything valid inside the LaunchSpecification. Requires an IamInstanceProfile to be able to tag itself.

POST: http://localhost:4000/v1/tasks/timeout
Required:
  {
    instanceid: xxxxxx,
    autoID: yyyyyyy
  }
Response: (201, "Instance ID is EC2InstanceID")
Info: To be called by ./searchScript or a terminating instance. Will start an EC2 instance with the same parameters.

POST: http://localhost:4000/v1/tasks/callback
Required:
{
  instanceid: xxxxxx,
  autoID: yyyyyyy
}
Response: (201, "Instance IDxxx Terminated")
Info:To be called when the docker job is done in the instance.
