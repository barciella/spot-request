#!/bin/bash
function callback {
        GETID="$(curl -s http://169.254.169.254/latest/meta-data/instance-id)"
      	curl -X POST -H "Content-Type: application/json; charset=UTF-8" -d "{\"instanceid\": \"'"$GETID"'\"}"  http://179.99.217.141:4000/v1/tasks/callback
        }

function termination {

}

while true
	do
			if docker ps -l | grep Exited
				then
					callback
			elif
				curl -s http://169.254.169.254/latest/meta-data/spot/termination-time | grep -q .*T.*Z
					then
						termination
			else
				sleep 5
			fi
done
