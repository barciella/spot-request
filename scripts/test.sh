#!/bin/bash
function callback {
        GETID="$(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
        TAGS="$(aws ec2 describe-tags --filters "Name=resource-id,Values=$GETID" | grep Value | awk -F '"' '{print $4}')"
      	curl -X POST -H "Content-Type: application/json; charset=UTF-8" -d "{\"instanceid\": \"'"$GETID"'\", \"autoID\": \"'"$TAGS"'\"}"  http://179.99.217.141:4000/v1/tasks/callback
        }

function timeout {
        GETID="$(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
        TAGS="$(aws ec2 describe-tags --filters "Name=resource-id,Values=$GETID" | grep Value | awk -F '"' '{print $4}')"
        curl -X POST -H "Content-Type: application/json; charset=UTF-8" -d "{\"instanceid\": \"$GETID\", \"autoID\": \"$TAGS\"}"  http://179.99.217.141:4000/v1/tasks/timeout
        }

while true
	do
			if docker ps -l | grep Exited
				then
					callback
			elif
				curl -s http://169.254.169.254/latest/meta-data/spot/termination-time | grep -q .*T.*Z
					then
						timeout
			else
				sleep 5
			fi
done
