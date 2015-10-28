/**
 * Created by kunalkaushik on 10/28/15.
 */
var FfmpegClusterController = require('../controller/ffmpegClusterController')
    , assert = require('assert')
    , should = require('should')
    , sinon = require('sinon');

describe('.FfmpegClusterController', function() {
    var ffmpegCluster = new FfmpegClusterController();
    var callback = sinon.spy();
    var job = 'fJob';
    var machine="dmcplailh239" ;


    it('should have property of addRecord', function() {
        ffmpegCluster.should.have.property('addRecord');
    });

    it('should have property of getFreeMachine', function() {
        ffmpegCluster.should.have.property('getFreeMachine');
    });

    it('should have property of releaseMachine', function() {
        ffmpegCluster.should.have.property('releaseMachine');
    });

    it('should have property of reserveMachine', function() {
        ffmpegCluster.should.have.property('reserveMachine');
    });


    it('insert db should be called once', function() {
        var db = sinon.stub(ffmpegCluster.db, 'insert');
        ffmpegCluster.addRecord(job, callback);

        assert(db.withArgs(job).calledOnce);
    });

    it('getFreeMachine db should be called once', function() {
        var db = sinon.stub(ffmpegCluster.db, 'findSortWithCriteria');
        ffmpegCluster.getFreeMachine(callback);

        assert(db.withArgs({isActive:true,isRunning:false}).calledOnce);
    });

   /** it('releaseMachine db should be called once', function() {
        var db = sinon.stub(ffmpegCluster.db, 'updateCluster');
        ffmpegCluster.releaseMachine(machine,callback);
        assert(db.withArgs({machineName:machine}, {$set: {isRunning: false, endDate: new Date()}}).calledOnce);
    });
      **/
    it('reserveMachine db should be called once', function() {
        var db = sinon.stub(ffmpegCluster.db, 'updateCluster');
        ffmpegCluster.reserveMachine(machine,callback);
        assert(db.withArgs({machineName:machine}, {$set: {isRunning: true, startDate: Date(), endDate:null}}).calledOnce);
    });


});