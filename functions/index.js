const functions = require('firebase-functions');
const admin = require('firebase-admin');
const max_limit_numbers = 10;
const questions_per_exam = 3;
admin.initializeApp(functions.config().firebase);

var db = admin.firestore();

exports.webhook = functions.https.onRequest((request, response) => {

        console.log("parameters: ", request.body.result.parameters);
        console.log("action: ", request.body.result.action);
        let params  = request.body.result.parameters;
        let numbers = params.numbers;
        var score = 0;
        var questionNumber = 0;
        var response_dict = {};
        var parameters_dict = {};

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
           case 'test_basic_addition':
              numbers1 = getRandomInt(0,max_limit_numbers)
              numbers2 = getRandomInt(0,max_limit_numbers)
              if (params.score!==""){
                  console.log("dentro del if basic addition: ", score);
                  score = params.score;
              }
              if(params.questionNumber!==""){
	          questionNumber = params.questionNumber;
              }

              parameters_dict.numbers1 = numbers1;
              parameters_dict.numbers2 = numbers2;
              parameters_dict.score = score;
              parameters_dict.questionNumber = questionNumber;
 
              response.send({
                  followupEvent: {
                      name: "test_mode_addition",
                      parameters: parameters_dict
                  },
                  contextOut: [
  		  {
  		     name: "test_mode_addition-followup",
    		     lifespan: 1,
    		     parameters: parameters_dict
 		 }
		],
              });
            break;
          case 'test_mode_addition.test_mode_addition-result':
              var result = parseInt(params.result);
	      var numbers1 = parseInt(params.numbers1);
	      var numbers2 = parseInt(params.numbers2);
              var sumres = sum(numbers1,numbers2);
              score = params.score;
              questionNumber = params.questionNumber + 1;
              console.log("mode_addition_result_score: " + score);
              response_dict.contextOut = [
	  		        {
	  		            name: "test_mode",
	    		            lifespan: 3,
	    		            parameters: {
		                        "score": score,
		                        "questionNumber": questionNumber
	     		            }
	       		        }
			   ];
              if (result === sumres){
                 score +=1;
                 response_dict.contextOut[0].parameters.score = score;
                 if (questionNumber === questions_per_exam){
                        response_dict.speech = `Correct! You have finished the exam. Your score is ${score} out of ${questionNumber}`;   
                 }else{
                        response_dict.speech = `Correct! Do you want to go to the next question? current score: ${score} out of ${questionNumber}`;
                 }
              }else{
		if (questionNumber === questions_per_exam){
                        response_dict.speech = `Incorrect! The correct answer is: ${sumres} .You have finished the exam. Your score is ${score} out of ${questionNumber}`;
                }else{
                        response_dict.speech = `Incorrect! The correct answer is: ${sumres} .Do you want to go to the next question? current score: ${score} out of ${questionNumber}`;
                }
	      }
              response.send(response_dict);
            break;
          case 'test_mode_addition.next_question':
              response.send({
                  followupEvent: {
                      name: "init_test_addition",
                      parameters: {
                          "score": params.score,
                          "questionNumber": params.questionNumber
                      }
                  },
              });
            break;
        }
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
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
