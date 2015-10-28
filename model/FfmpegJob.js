/**
 * Created by kunalkaushik on 10/16/15.
 */
var mongoose = require('mongoose');
var con = require('./DbConn.js');
var Schema = mongoose.Schema;

function FfmpegJob(uri, collectionName){


    var DBConnection = new con( uri);
    this.connection=DBConnection.getConnection();

    try {
        if (mongoose.model('FfmpegJobModel')) {
            this.FfmpegJobModel =mongoose.model('FfmpegJobModel');
        }
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var ffmpegJobSchema = new Schema({
                sourceFilePath: String
                , destFilePath: String
                , status: String
                , callbackUrl: String
                , createDate: Date
                , startDate: Date
                , endDate: Date
                , token: String
                , profile: String
                , height: Number
                , width: Number
                , videoBitrate: String   //depends on profile
                , audioBitrate: String    //depends on profile
                , format: String         //example mp4
                , machineName:String    //servername for clustering
                , priority: Number
            }, { collection: collectionName, versionKey: false });
            this.FfmpegJobModel = this.connection.model('FfmpegJobModel', ffmpegJobSchema);
        }
    }
};

/**
 * insert
 * find all the documents without a search criteria
 * @param job
 * @param callback
 */
FfmpegJob.prototype.insert = function (job, callback) {
    this.FfmpegJobModel.create(job, function (err, log) {
        if (err) callback(err);
        else callback(null,log);
    });
};

/**
 * findSortWithCriteria
 * find all the documents without a search criteria
 * @param sortOrder
 * @param criteria
 * @param callback
 */
FfmpegJob.prototype.findSortWithCriteria = function (sortOrder,criteria,callback) {
    this.FfmpegJobModel
        .find(criteria)
        .sort(sortOrder)
        .exec(function (err, doc) {
            if (err) callback(err);
            else callback(null,doc);
        });
};

/**
 * findSortWithCriteria
 * find all the documents without a search criteria
 * @param sortOrder
 * @param criteria
 * @param callback
 */
FfmpegJob.prototype.findSort = function (sortOrder,callback) {
    this.FfmpegJobModel
        .find()
        .sort(sortOrder)
        .exec(function (err, doc) {
            if (err) callback(err);
            else callback(null,doc);
        });
};

/**
 * updateJob
 * find all the documents without a search criteria
 * @param job
 * @param callback
 */
FfmpegJob.prototype.updateJob = function (token,updates, callback) {
   // this.FfmpegJobModel.update({ _id: {"$in":[{"$oid":jobId}]}},updates, function (err, log) {
    this.FfmpegJobModel.update({ token:token },updates, function (err, log) {
        if (err) callback(err);
        else callback(null,log);
    });
};

/**
 * updateJob
 * find all the documents without a search criteria
 * @param job
 * @param callback
 */
FfmpegJob.prototype.updateJobWithJobId = function (jobId,updates, callback) {
    // this.FfmpegJobModel.update({ _id: {"$in":[{"$oid":jobId}]}},updates, function (err, log) {
    this.FfmpegJobModel.update({ _id:jobId },updates, function (err, log) {
        if (err) callback(err);
        else callback(null,log);
    });
};

module.exports = FfmpegJob;