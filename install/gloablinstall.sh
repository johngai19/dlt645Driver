#!/bin/bash
echo 'start to check node env:'
   if ! type node 2>/dev/null || [[ `node -v` != 'v8.17.0' ]] ; then
     echo 'node Running Enviroment Error, start to build...'
     wget -qO- https://deb.nodesource.com/setup_10.x | sudo -E bash -
     sudo apt-get install -y nodejs
     echo 'Node install success full'
     echo 'Install production package support'
     npm install -g cnpm --registry=https://registry.npm.taobao.org
     cnpm install --production
     echo 'success'
   fi
echo 'end'