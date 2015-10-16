/**
 * Created by kunalkaushik on 10/16/15.
 */
var sendResponse = function(req, res, content) {

    // res.header('Access-Control-Allow-Origin', "*");
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Allow-Headers', 'Content-Type');

    if ( req.accepts('application/json') && req.is('application/json') ) {
        res.json(content);
        // next();

    }
    else {
        res.contentType('js');
        var json = JSON.stringify(content, null, 3);
        if ( req.query && req.query.callback )
            json = req.query.callback + '(' + json + ');';
        res.send(json);
        //next();
    }
}

module.exports = sendResponse;