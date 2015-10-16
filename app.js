/**
 * Module dependencies.
 */

var express = require('express');
var ffmpegJob = require('./routes/ffmpegJob');
var job = ffmpegJob.Generate();


var http=require('http');

var app = express()
    , httpapp = module.exports =  express();

http.globalAgent.maxSockets=50;
server.globalAgent.maxSockets=50;


// Configuration
httpapp.configure(function(){
  httpapp.set('jsonp callback', true);
  httpapp.set('env', 'production');
  httpapp.use(express.bodyParser());
  httpapp.use(express.methodOverride());
  httpapp.use(httpapp.router);
  httpapp.use(express.static(__dirname + '/public'));
  httpapp.use(function(err, req, res, next) {
    if (err && err.message) {
      console.error("Error: ", err.message);
    }
    res.contentType('js');
    res.status(500);
    res.send(JSON.stringify({ message: err.message, code: 500 }, null, 3), 500);
  });
});

httpapp.all('*', function(req, res, next){
  var ip="";
  if(req.headers){
    ip=(req.headers['x-forwarded-for'] || '').split(',')[0]
        || req.connection.remoteAddress;
  }
  console.log(req.url +' IP '+ip);
  next();
});


//httpapp.get('/externalip',extIp.renderExternalIp);
httpapp.options('/submitjob', job.submitJob);
httpapp.post('/submitjob', job.submitJob);


//server.createServer(options, httpapp).listen(port,'127.0.0.1');
//http.createServer(httpapp).listen(8082);
http.createServer(httpapp).listen(8081);

console.log("[INFO] App - Server is listening on port %d in %s mode.", port, httpapp.settings.env);