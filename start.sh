#!/bin/bash
nohup npm run start &
echo -e \n
#use fg to bring job back to terminal
#use following script to show the pid and kill it if necessary
#ps -e|grep node

#to start the script when start up, local the path of this script
#crontab -e
#add following lines
#@reboot yourpath/start.sh