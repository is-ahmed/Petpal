#!/bin/bash

# Assuming that current user is in sudoers file
sudo apt-get update && sudo apt-get upgrade -y
sudo apt-get install \
	python3-pip \
	python3-dev \
	python3-setuptools \
	python3-virtualenv \
	libtiff5-dev libjpeg8-dev libopenjp2-7-dev zlib1g-dev \
    libfreetype6-dev liblcms2-dev libwebp-dev tcl8.6-dev tk8.6-dev python3-tk \
    libharfbuzz-dev libfribidi-dev libxcb1-dev


cd ./petpal
virtualenv -p /usr/bin/python3 venv
source venv/bin/activate
pip3 install -r requirements.txt
./manage.py makemigrations
