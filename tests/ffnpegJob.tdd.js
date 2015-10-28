/**
 * Created by kunalkaushik on 10/28/15.
 */
var FfmpegJobController = require('../controller/ffmpegJobController')
    , assert = require('assert')
    , should = require('should')
    , sinon = require('sinon');

describe('.FfmpegJobController', function() {
    var ffmpegJob = new FfmpegJobController();
    var callback = sinon.spy();
    var job = 'fJob';
    var machine="dmcplailh239" ;
    var token="rwerewqrw";
    var status="1";

    it('should have property of addRecord', function() {
        ffmpegJob.should.have.property('addRecord');
    });

    it('should have property of getJob', function() {
        ffmpegJob.should.have.property('getJob');
    });

    it('should have property of getAllJob', function() {
        ffmpegJob.should.have.property('getAllJob');
    });

    it('should have property of updateJobStatus', function() {
        ffmpegJob.should.have.property('updateJobStatus');
    });

    it('should have property of assignJob', function() {
        ffmpegJob.should.have.property('assignJob');
    });

    it('db should be called once', function() {
        var db = sinon.stub(ffmpegJob.db, 'insert');
        ffmpegJob.addRecord(job, callback);

        assert(db.withArgs(job).calledOnce);
    });

    it('getJob db should be called once', function() {
        var db = sinon.stub(ffmpegJob.db, 'findSortWithCriteria');
        ffmpegJob.getJob(machine,callback);

        assert(db.withArgs({priority: -1,createDate:1 },{machineName:machine}).calledOnce);
    });

    it('getAllJob db should be called once', function() {
        var db = sinon.stub(ffmpegJob.db, 'findSort');
        ffmpegJob.getAllJob(callback);
        assert(db.withArgs({priority: -1,createDate:1 }).calledOnce);
    });

    it('updateJobStatus db should be called once', function() {
        var db = sinon.stub(ffmpegJob.db, 'updateJob');
        ffmpegJob.updateJobStatus(token,status,callback);
        assert(db.withArgs(token, {$set: {status: status, startDate: Date()}}).calledOnce);
    });

    it('assignJob db should be called once', function() {
        var db = sinon.stub(ffmpegJob.db, 'updateJobWithJobId');
        ffmpegJob.assignJob(job,machine,callback);
        assert(db.withArgs(job, {$set: {machineName: machine}} ).calledOnce);
    });
});