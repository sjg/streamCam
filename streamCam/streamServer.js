var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var path = require('path');

var port = 8080;
var secs = 5;
 
var spawn = require('child_process').spawn;
var proc;
var timer;
 
var sockets = {};

app.get('/view', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/img', function(req, res) {
  res.writeHead(200, {'Content-Type': 'image/jpg' });
  fs.createReadStream(__dirname+ "/stream/image_stream.jpg", 'utf-8').pipe(res);
  global.gc();
});
 
io.on('connection', function(socket) {
  
  // Connection Active
  sockets[socket.id] = socket;
  console.log("IP Connected: " + socket.request.connection.remoteAddress);

  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  if(timer == undefined){
    console.log("Started Camera Timer ...");
    timer = setInterval(function(){
      grabImage();
    }, secs * 1000);
    grabImage();
  }

  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    console.log("Disconnected!");
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
      console.log('Killing Stream!');
      app.set('watchingFile', false);
      clearInterval(timer);
      timer = undefined;
      console.log("Stopped Camera Timer ...");
    }
  });
 
});
 
http.listen(port, function() {
  console.log('listening on *:'+port);
});
 
function grabImage(){
	var cmd = "/usr/bin/raspistill -w 1920 -h 1080 -n -t 1 -o "+__dirname+"/stream/image_stream.jpg"
	var exec = require("child_process").exec;
        exec(cmd, function(error, stdout, stderr){
          io.sockets.emit('liveStream', 'img?_t=' + (Math.random() * 100000));
          //console.log("send");
	});
}
