/**
 * Created by kunalkaushik on 10/16/15.
 */
var ffmpegJobController = require('../controller/ffmpegJobController.js');
var SendResponse = require('../libs/sendResponse.js');
var config = require('../config')('dmg_ffmpeg_job');

exports.Generate = function (dbhost, dbport) {

    var FfmpegJobController = new ffmpegJobController( config.url, config.collection);

    function isEmpty(query) {
        for(var prop in query) {
            if (query.hasOwnProperty(prop) && prop !== 'callback' && prop !== '_') return false;
        }

        console.log("Generate %d in %s", config.url,config.collection);
        return true;
    };

    return {

        submitJob: function(req, res, next) {


                    if (!isEmpty(req.body)) {

                        var record = JSON.parse(JSON.stringify(req.body));

                        FfmpegJobController.addRecord(record, function (err, result) {

                            if (err) {
                                next(err || new Error('[ERROR] FfmpegJobController.addRecord db error'));
                                return;
                            }
                            SendResponse(req, res, dLResult);

                        });

                    } else {
                        // initial post response
                        SendResponse(req, res, {});
                    }

        },

    };
};