/**
 * Created by kunalkaushik on 10/16/15.
 */
var ffmpegJobController = require('../controller/ffmpegJobController.js');
var ffmpegClusterController = require('../controller/ffmpegClusterController.js');
var SendResponse = require('../libs/sendResponse.js');
var config = require('../config')('dmg_ffmpeg_job');
var configCluster = require('../config')('dmg_ffmpeg_cluster');

exports.Generate = function (dbhost, dbport) {

    var FfmpegJobController = new ffmpegJobController( config.url, config.collection);
    var FfmpegClusterController = new ffmpegClusterController( configCluster.url, configCluster.collection);

    function isEmpty(query) {
        for(var prop in query) {
            if (query.hasOwnProperty(prop) && prop !== 'callback' && prop !== '_') return false;
        }

        console.log("Generate %d in %s", config.url,config.collection);
        return true;
    };


    function assignJob(jobId,machineName){
        //assign the job to machine
        FfmpegJobController.assignJob(jobId,machineName, function (err, assignedJob) {

            if (err) {
                next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                return;
            }



        });

    }

    function updateJobStatus(jobId,status){
        //assign the job to machine
        FfmpegJobController.updateJobStatus(jobId,status, function (err, assignedJob) {

            if (err) {
                next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                return;
            }



        });

    }

    function reserveMachine(machineName){

        FfmpegClusterController.reserveMachine(machineName, function (err, reserveMachine) {

            if (err) {
                next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                return;
            }

        });
    }

    function releaseMachine(machineName){

        FfmpegClusterController.releaseMachine(machineName, function (err, reserveMachine) {

            if (err) {
                next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                return;
            }

        });
    }

    function doJobAssignment(machineName){


        FfmpegJobController.getAllJob(function (err, jobs) {

            if (err) {
                next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                return;
            }

            if(jobs.length> 0) {


                //for every job
                //get free machine and assign it.

                //assign the job to machine
                assignJob(jobs[0]._id,machineName);

                //mark it as running in cluster config.
                reserveMachine(machineName);

            }



        });
    }


    return {

        submitJob: function(req, res, next) {

            console.log("Submitting job");
                    if (!isEmpty(req.body)) {

                        var record = JSON.parse(JSON.stringify(req.body));
                        console.log("Stringify Job "+ record);

                        FfmpegJobController.addRecord(record, function (err, result) {

                           // console.log(" ");
                            if (err) {
                                next(err || new Error('[ERROR] FfmpegJobController.addRecord db error'));
                                return;
                            }

                            //assign job if there is free machine.
                             var jobId=result._id;

                            FfmpegClusterController.getFreeMachine(function (err, freeMachines) {

                                console.log("freeMachines length"+ freeMachines.length);
                                if (err) {
                                    next(err || new Error('[ERROR] FfmpegJobController.addRecord db error'));
                                    return;
                                }

                                var machineName='';
                                //Once free machine is returned
                                // assign that job to free machine
                                if(freeMachines.length> 0)
                                {
                                    for(var i = 0 ; i < freeMachines.length; i++){
                                        machineName=freeMachines[i].machineName;
                                        break;
                                    }
                                    //assign the job to machine
                                   assignJob(jobId,machineName);

                                    //mark it as running in cluster config.
                                    reserveMachine(machineName);


                                   // send the response.
                                    SendResponse(req, res, result);

                                } else{ //No free machine do not assign
                                    SendResponse(req, res, result);
                                }


                            });

                        });

                    } else {
                        // initial post response
                        console.log("Blank body");
                        SendResponse(req, res, {});
                    }

        },



        getJob: function(req, res, next) {


                //var record = JSON.parse(JSON.stringify(req.body));
                var machineName = req.headers['machine'];
               console.log("Getting job for machine  "+machineName);
                FfmpegJobController.getJob(machineName, function (err, result) {

                    if (err) {
                        next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                       return;
                    }

                    if(result.length> 0) {
                        updateJobStatus(result[0]._id, "1");
                    }
                    SendResponse(req, res, result[0]);




                    console.log("job for machine  "+machineName + " is " +result);

                });


        },

        updateJobStatus: function(req, res, next) {


            //var record = JSON.parse(JSON.stringify(req.body));
            var machineName = req.headers['machine'];
            var token= req.headers['token'];
            var status = req.headers['status'];
            console.log("Getting job for machine  "+machineName + " " + token+" "+status);
            FfmpegJobController.updateJobStatus(token,status, function (err, result) {

                if (err) {
                    next(err || new Error('[ERROR] FfmpegJobController.getJob db error'));
                    return;
                }

                //assign job if its free.

                console.log("update successfull")

                if(status=="2"){
                    releaseMachine(machineName);  //should we release the machine in case of error too
                    //since we have released machine assign jobs.
                    doJobAssignment(machineName);

                }

                SendResponse(req, res, result);
                console.log("job for machine  "+machineName + " is " +result);

            });


        },

        addMachinesToCluster: function(req, res, next) {


            if (!isEmpty(req.body)) {

                var record = JSON.parse(JSON.stringify(req.body));
                console.log("Stringify Job "+ record);

                FfmpegClusterController.addRecord(record, function (err, result) {

                    // console.log(" ");
                    if (err) {
                        next(err || new Error('[ERROR] FfmpegJobController.addRecord db error'));
                        return;
                    }

                    // send the response.
                    SendResponse(req, res, result);
                });

            } else {
                // initial post response
                console.log("Blank body");
                SendResponse(req, res, {});
            }


        },

    };
};