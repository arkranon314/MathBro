const functions = require('firebase-functions');

exports.webhook = functions.https.onRequest((request, response) => {

        console.log("parameters: ", request.body.result.parameters);
        let params  = request.body.result.parameters;
        let numbers = params.numbers;
        switch(request.body.result.action){
          case 'sum':
              numbers = numbers.reduce(sum,0);
              send();
            break;
          case 'subtract':
              numbers = numbers.reduce(subtract);
              send();
            break;
          case 'multiply':
              numbers = numbers.reduce(multiply);
              send();
            break;
          case 'divide':
              numbers = numbers.reduce(divide);
              send();
            break;
        }

        function sum(x, y){return x + y}
        function subtract(x, y){return x - y}
        function multiply(x, y){return x * y}
        function divide(x, y){return x / y}
        function send(){
          response.send({
                  speech:
                      "The result is " + numbers
              });}
    });
