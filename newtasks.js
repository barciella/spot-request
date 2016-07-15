Finish the timeout function.
Configure the userdata
  Cloud-config to start Docker with the dockerImageId
  Get script to check if spot instance is being terminated and call ./timeout to create ec2 or /callback to finish the instance
  Get script on ec2 to /callback and finish instance

Configure a service to run every 15 minutes that will get a list of open spot requests.
If the time now is greater than 15 minutes of the start of the request call the timeout function for that id that is tagged.
