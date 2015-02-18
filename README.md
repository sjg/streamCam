# streamCam - A Streaming WebCamera for Raspberry Pi built in node
A quick, and dirty, websocket enabled webcam server which can be used to create timelapses with the Raspberry Pi.  The project contains two separate components, an express server which runs on the Raspberry Pi to grab images from the webcam and a server which pulls the image for archiving on a separate server to create the timelapse.  

## How it works
Simply, when a client connects to the Camera Server, the Raspberry Pi starts taking an image every 5 seconds and notifies all connected apps when a new image is ready to download.  When the Archiving Server receives the websocket event, it pulls down the image from the Camera Server and archives the image for post processing into a timelapse (See scripts folder). 

## Timelapse Example
[![ScreenShot](http://img.youtube.com/vi/sSMLG8LCd34/0.jpg)](http://youtu.be/sSMLG8LCd34)

##  Clean install on a fresh Raspberry Pi

### Install Latest version of Node
wget http://node-arm.herokuapp.com/node_latest_armhf.deb
sudo dpkg -i node_latest_armhf.deb

### Install Modules
sudo npm install -g forever

### Testing the Camera
sudo chmod 777 /dev/vchiq
/usr/bin/raspistill -w 1920 -h 1080 -n -t 1 -o ./image_stream.jpg

### Running the Camera Server
node --expose-gc streamCam/streamServer.js

### Running Camera Server at boot - Add to /etc/rc.local
sudo chmod 777 /dev/vchiq
su - USERNAME -c "NODE_ENV=production /usr/local/bin/forever start -c "/usr/local/bin/node --expose-gc" /path/to/streamCam/streamServer.js

### Running the Archive Server
node streamCam-server/getSocketImage.js

## Create Timelapse
In the streamCam-server folder there are scripts which can be run with crontab that create the timelapses for the project and post a automatic tweet of the last image taken.