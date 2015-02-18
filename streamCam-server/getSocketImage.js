var fs = require('fs'),
    request = require('request'),
    XDate = require('xdate');

var ip = "http://127.0.0.1:8080";
var savePath = "./data";

var socket = require('socket.io-client')(ip);

var started = 0;

var currentDate = new XDate();

socket.on('connect', function(){
	console.log("Connected!");
	socket.emit("start-stream", {});

	if(!started){
		socket.on('liveStream', function(url) {
			getImage(ip + "/" + url);
			started = 1;
		});
	}
});

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var pad = function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

var counter = 0;
var dayFolder = new XDate().toString("dd-MM-yyyy");

if (!fs.existsSync(savePath+"/"+dayFolder)) {
    // Create Folder if data folder not exists
    fs.mkdirSync(savePath+"/"+dayFolder);
}

var getImage = function(url){

        if(new XDate().toString("d") != currentDate.toString("d")){
            // Date has changed create new folder and upload 
            currentDate = new XDate().toString("d");
            dayFolder = new XDate().toString("dd-MM-yyyy");
            counter = 0;
            
            if (!fs.existsSync(savePath+"/"+dayFolder)) {
                // Create Folder
                fs.mkdirSync(savePath+"/"+dayFolder);
            }

        }

        var currentImageFile = savePath+"/"+dayFolder+"/timelapse_" + pad(counter, 5) + ".jpg";
        download(url, currentImageFile, function(){
                console.log(new XDate().toString('d/M/yy h(:mm:ss)TT') + '\tDone: ' + currentImageFile);
                counter++;
        });
}



