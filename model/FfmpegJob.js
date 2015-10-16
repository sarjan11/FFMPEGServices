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
                , Height: Number
                , Width: Number
                , videoBitrate: String   //depends on profile
                , audioBitrate: String    //depends on profile
                , format: String         //example mp4
                , machineName:String    //servername for clustering
            }, { collection: collectionName, versionKey: false });
            this.FfmpegJobModel = this.connection.model('FfmpegJobModel', ffmpegJobSchema);
        }
    }
};

// public function
FfmpegJob.prototype.insert = function (job, callback) {
    this.FfmpegJobModel.create(job, function (err, log) {
        if (err) callback(err);
        else callback(null,log);
    });
};


module.exports = FfmpegJob;