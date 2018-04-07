'use strict';

const functions = require('firebase-functions'); 

exports.mathBro = functions.https.onRequest((request, response) => {

    let res;

    if (request.body.result.metadata.intentName == "square") {
        
        let num = request.body.result.parameters.number;
        let sq = square(num);
        
        res = 'The square of ' + num + ' is ' + sq;

    }
    else {

        res = 'Sorry, I didn\'t get that.';

    }

    response.setHeader('Content-Type', 'application/json');
    response.send(JSON.stringify({ "speech": res, "displayText": res}));

    function square(n) { return n*n; }

});