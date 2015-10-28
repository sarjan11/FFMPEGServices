/**
 * Created by kunalkaushik on 10/16/15.
 */
// using db
var FfmpegClusterModel = require('../model/FfmpegCluster.js');

// class constructor
function FfmpegClusterController(uri, collection){

    this.db = new FfmpegClusterModel(uri, collection)

};

FfmpegClusterController.prototype.addRecord = function (job, callback){
    this.db.insert(job, function (err, doc) {
        if (err) callback(err);
        else callback(null,doc);
    });
};

FfmpegClusterController.prototype.getFreeMachine = function (callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {
    this.db.findSortWithCriteria({isActive:true,isRunning:false}, function (err, doc) {
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

FfmpegClusterController.prototype.releaseMachine = function (machineName,callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {

        this.db.updateCluster({machineName:machineName}, {$set: {isRunning: false, endDate: new Date()}}, function (err, doc) {
        if (err) callback(err);
        else callback(null, doc);
        });

};

FfmpegClusterController.prototype.reserveMachine = function (machineName,callback){
    //this.db.findSortWithCriteria({Subtitle: 1,UiCategory:1 },{machineName:"dmcplailh239",AppKeys: { $in: [appKey]},IsDeleted:false,Channels:{$in: channels},Subtitle: { $nin: ["",null]}}, function (err, doc) {

    this.db.updateCluster({machineName:machineName}, {$set: {isRunning: true, startDate: Date(), endDate:null}}, function (err, doc) {
        if (err) callback(err);
        else callback(null, doc);
    });

};

module.exports = FfmpegClusterController;