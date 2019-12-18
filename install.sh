#!/bin/bash
echo -e '\033[32m Start to install necessary dependencies \032[0m'
echo -e '\033[37m    \037[0m'
sudo apt-get install wget -y
sudo apt-get install curl -y
sudo apt-get install git -y
echo -e '\033[32m Start to download Repository \032[0m'
echo -e '\033[37m    \037[0m'
git clone https://github.com/weizy0219/dlt645Driver.git
cd dlt645Driver
cd install
echo -e '\033[32m Start to install project dependencies \032[0m'
echo -e '\033[37m    \037[0m'
sudo chmod 700 nvminstall.sh
./nvminstall
# sudo chmod 700 globalinstall.sh
# ./globalinstall