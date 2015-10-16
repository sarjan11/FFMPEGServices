/**
 * Created by kunalkaushik on 10/16/15.
 */
var mongoose = require('mongoose'),
    databaseConnection;

function DBConnection(uri){
    if ( !databaseConnection ) {
        mongoose.connect(uri);
        databaseConnection = mongoose.connection;
    }
    //this.db = new BrowsePopoverModel(uri, collection)

};

DBConnection.prototype.getConnection = function (){
    return databaseConnection;
};

// public function
//CONNECTION EVENTS

mongoose.connection.on('connected', function () {

    console.log('Mongoose default connection open');

});

// If the connection throws an error

mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);

});

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {

    console.log('Mongoose default connection disconnected');

});


// If the Node process ends, close the Mongoose connection

process.on('SIGINT', function() {

    mongoose.connection.close(function () {

        console.log('Mongoose default connection disconnected through app termination');

        process.exit(0);
    });
});


module.exports = DBConnection;