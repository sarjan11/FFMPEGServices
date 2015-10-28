var express = require('express');
var path = require('path');
var ffmpegJob = require('./routes/ffmpegJob');
var job = ffmpegJob.Generate();

var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true,
  saveUninitialized: true,
  secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  if (err && err.message) {
    console.error("Error: ", err.message);
  }
  res.contentType('js');
  res.status(500).send(JSON.stringify({ message: err.message, code: 500 }, null, 3));
 // res.send(JSON.stringify({ message: err.message, code: 500 }, null, 3), 500);
});


app.options('/submitjob', job.submitJob);
app.post('/submitjob', job.submitJob);
app.get('/getjob', job.getJob);
app.get('/updatejob',job.updateJobStatus);
app.options('/addmachine', job.addMachinesToCluster);
app.post('/addmachine', job.addMachinesToCluster);

// error handling middleware should be loaded after the loading the routes
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});