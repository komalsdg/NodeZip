var express = require('express')
var http = require('http');
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

const folderName = 'zipTest';

app.get('/', function(req, res){
  res.render('index',{message:null});
});

//Download zip folder from project root-- using createwritestream
app.get("/root", function(req, res) {
    
  var archiver = require('archiver');
  var archive = archiver('zip');

    const source = path.join(__dirname,folderName);
    
    archive.on('error', function(err) {
      res.render('index',{message: err.message,});
    });
    archive.on('end', function() {
      console.log('Archive wrote %d bytes', archive.pointer());
    });

    const stream = fs.createWriteStream(__dirname + "\\" + folderName +'.zip');

    archive
        .directory(source, false)
        .append('Hello!',{name:'file.txt'})
        .on('error', err => {throw err;})
        .pipe(stream);
        
    stream.on('close', () => {res.render('index',{message:'Zip created'}); console.log("closed")});
    archive.finalize();
    console.log("zip created");
  });


//Download zip file from Desktop
app.get('/desktop', function (req, res) {

  var archiver = require('archiver');
  var archive = archiver('zip');

  var os=require('os');
  var homedir=os.homedir();

  archive.on('error', function(err) {
    res.render('index',{message: err.message});
  });
  archive.on('end', function() {
    console.log('Archive wrote %d bytes', archive.pointer());
  });

  res.attachment(folderName + '.zip');

  const source = path.join(homedir + "\\desktop\\",folderName);

  archive
      .directory(source, false)
      .on('error', err => {throw err;})
      .pipe(res);

     archive.finalize();
});

module.exports = app;

//listening to server
var server = app.listen(4001,function(){
  console.log(__dirname);
	console.log("Listening to port %s",server.address().port);
});