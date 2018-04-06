const functions = require('firebase-functions');

exports.webhook = functions.https.onRequest((request, response) => {

        console.log("parameters: ", request.body.result.parameters);
        let params  = request.body.result.parameters;
        var numbers = params.numbers;
        switch(request.body.result.action){
          case 'sum':
              numbers = numbers.reduce(sum,0);
              response.send({
                  speech:
                      "The result is " + numbers
              });
            break;
          case 'subtract':
              numbers = numbers.reduce(subtract);
              response.send({
                  speech:
                      "The result is " + numbers
              });
              console.log(respone)
            break;
        }

        function sum(x, y){return x + y}
        function subtract(x, y){return x - y}
    });