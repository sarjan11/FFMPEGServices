/**
 * Created by kunalkaushik on 10/16/15.
 */
// using db
var FfmpegJobModel = require('../model/FfmpegJob.js');

// class constructor
function FfmpegJobController(uri, collection){

    this.db = new FfmpegJobModel(uri, collection)

};

// public function
FfmpegJobController.prototype.addRecord = function (job, callback){
    this.db.insert(job, function (err, doc) {
        if (err) callback(err);
        else callback(null,doc);
    });
};

FfmpegJobController.prototype.getJob = function (machineName,callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {
    this.db.findSortWithCriteria({priority: -1,createDate:1 },{machineName:machineName}, function (err, doc) {
        if (err) callback(err);
        else callback(null,doc);
    });
};

FfmpegJobController.prototype.getAllJob = function (callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {
    this.db.findSort({priority: -1,createDate:1 }, function (err, doc) {
        if (err) callback(err);
        else callback(null,doc);
    });
};

/**FfmpegJobController.prototype.updateJobStarted = function (jobId,callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {
    this.db.updateJob(jobId,{ $set: { status: '1', startDate:new utcDate() }}, function (err, doc) {
        if (err) callback(err);
        else callback(null,doc);
    });
};
**/

FfmpegJobController.prototype.updateJobStatus = function (token,status,callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {
    if(status=="1"){
        this.db.updateJob(token, {$set: {status: status, startDate: Date()}}, function (err, doc) {
        if (err) callback(err);
        else callback(null, doc);
        });
    }else {
        this.db.updateJob(token, {$set: {status: token, endDate: Date()}}, function (err, doc) {
            if (err) callback(err);
            else callback(null, doc);
        });
    }
};

FfmpegJobController.prototype.assignJob = function (jobId,machineName,callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {

        this.db.updateJobWithJobId(jobId, {$set: {machineName: machineName}}, function(err, doc) {
            if (err) callback(err);
            else callback(null, doc);
        });

};

module.exports = FfmpegJobController;