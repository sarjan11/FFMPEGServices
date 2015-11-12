/**
 * Created by kunalkaushik on 10/16/15.
 */
var mongoose = require('mongoose');
var con = require('./DbConn.js');
var Schema = mongoose.Schema;

function FfmpegCluster(uri, collectionName){


    var DBConnection = new con( uri);
    this.connection=DBConnection.getConnection();

    try {
        if (mongoose.model('FfmpegClusterModel')) {
            this.FfmpegClusterModel =mongoose.model('FfmpegClusterModel');
        }
    } catch(e) {
        if (e.name === 'MissingSchemaError') {
            var FfmpegClusterSchema = new Schema({
                machineName: String
                , isRunning: Boolean
                , isActive: Boolean
                , startDate: Date
                , endDate: Date

            }, { collection: collectionName, versionKey: false });
            this.FfmpegClusterModel = this.connection.model('FfmpegClusterModel', FfmpegClusterSchema);
        }
    }
};

/**
 * insert
 * find all the documents without a search criteria
 * @param job
 * @param callback
 */
FfmpegCluster.prototype.insert = function (job, callback) {
    this.FfmpegClusterModel.create(job, function (err, log) {
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
FfmpegCluster.prototype.findSortWithCriteria = function (criteria,callback) {
    this.FfmpegClusterModel
        .find(criteria)
       // .sort(sortOrder)
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
FfmpegCluster.prototype.updateCluster = function (query,updates,callback) {
    this.FfmpegClusterModel.update(query,updates, function (err, log) {
        if (err) callback(err);
        else callback(null,log);
    });
};


module.exports = FfmpegCluster;