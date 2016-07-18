#!/bin/bash
while true
	do
			if docker ps -l | grep Exited
				then touch /etc/callback.txt

			elseif
				curl -s http://169.254.169.254/latest/meta-data/spot/termination-time | grep -q .*T.*Z;
					then touch /etc/timeout.txt
			else
				sleep 5
			fi
done
