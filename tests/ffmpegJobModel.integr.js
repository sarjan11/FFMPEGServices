/**
 * Created by kunalkaushik on 10/28/15.
 */
var mongoose = require('mongoose');
var DownloadLog = require('./../models/DownloadLog');
var should = require('should');
var config = require('../config')('sro2go_app_download_test');

describe('DownloadLog', function(){
    var downloadLog = new DownloadLog(config.url, config.collection);

    var mockDate = Date.now();

    var DownloadLogMock = { assetid: 1
        , downloadurl: 'http://someplace.com'
        , status: 'current'
        , percentagecomplete: 100
        , startdate: mockDate
        , enddate: mockDate
        , expirationdate: mockDate
        , token: mockDate
        , pid: 2
        , synchdate: mockDate
    };

    beforeEach(function(done){

        downloadLog.insert(DownloadLogMock, function(err, doc){
            currentDownloadLogMock = doc;
            done();
        });
    });



    afterEach(function(done){
        downloadLog.DownloadLogModel.remove({}, function(){
            done();
        });
    });

    it('insert  download log object', function(done){
        downloadLog.insert(DownloadLogMock, function( err, download){
            download.downloadurl.should.eql('http://someplace.com');
            done();
        });
    });

    it('fetches download log by downloadurl', function(done){
        downloadLog.findByUrl({downloadurl: DownloadLogMock.downloadurl}, function( err, download){
            download.downloadurl.should.eql('http://someplace.com');
            done();
        });
    });
});