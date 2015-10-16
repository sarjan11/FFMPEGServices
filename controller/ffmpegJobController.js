/**
 * Created by kunalkaushik on 10/16/15.
 */
// using db
var FfmpegJobModel = require('../model/.js');

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

module.exports = FfmpegJobController;