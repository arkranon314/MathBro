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
  let number = params.number;
  var score = 0;
  var questionNumber = 0;
  var response_dict = {};
  var parameters_dict = {};
  var result, numbers1, numbers2, res;

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
    case 'square':
        numbers = square(number);
        send();
        break;
    case 'square_root':
        numbers = root(number);
        send();
        break;
    case 'circle_area':
        numbers = circle_area(number);
        send();
        break;
    case 'triangle_area':
        numbers = numbers.reduce(triangle_area);
        send();
        break;
    case 'square_area':
        numbers = square_area(number);
        send();
        break;
    case 'rectangle_area':
        numbers = numbers.reduce(multiply);
        send();
        break;
    case 'pentagon_area':
        numbers = pentagon_area(number);
        send();
        break;
    case 'hexagon_area':
        numbers = hexagon_area(number);
        send();
        break;
    case 'test_basic_addition':
        generateQuestion("test_mode_addition","test_mode_addition-followup");
        break;
    case 'test_mode_addition.test_mode_addition-result':
        result = parseInt(params.result);
        numbers1 = parseInt(params.numbers1);
        numbers2 = parseInt(params.numbers2);
        res = sum(numbers1,numbers2);
        getResult();
        response.send(response_dict);
        break;
    case 'test_mode_addition.next_question':
        sendFollowUpEvent("init_test_addition");
        break;
    case 'test_basic_subtraction':
        generateQuestion("test_mode_subtraction", "test_mode_subtraction-followup");
        break;
    case 'test_mode_subtraction.test_mode_subtraction-result':
        result = parseInt(params.result);
        numbers1 = parseInt(params.numbers1);
        numbers2 = parseInt(params.numbers2);
        res = subtract(numbers1,numbers2);
        getResult();
        response.send(response_dict);
        break;
    case 'test_mode_subtraction.next_question':
        sendFollowUpEvent("init_test_subtraction");
        break;
  }
  function generateQuestion(followUpEventName,contextName){
    numbers1 = getRandomInt(0,max_limit_numbers)
    numbers2 = getRandomInt(0,max_limit_numbers)
    if (params.score!==""){
      score = parseInt(params.score);
    }
    if(params.questionNumber!==""){
      questionNumber = parseInt(params.questionNumber);
    }
    parameters_dict.numbers1 = numbers1;
    parameters_dict.numbers2 = numbers2;
    parameters_dict.score = score;
    parameters_dict.questionNumber = questionNumber;

    response.send({
      followupEvent: {
        name: followUpEventName,
        parameters: parameters_dict
      },
      contextOut: [
        {
          name: contextName,
          lifespan: 1,
          parameters: parameters_dict
        }
      ],
    });
  }
  function getResult(){
    score = parseInt(params.score);
    questionNumber = parseInt(params.questionNumber) + 1;
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
    if (result === res){
      score +=1;
      response_dict.contextOut[0].parameters.score = score;
      if (questionNumber === questions_per_exam){
        response_dict.contextOut[0].parameters.score = 0;
        response_dict.contextOut[0].parameters.questionNumber = 0;
        response_dict.speech = `Correct! You have finished the exam. Your score is ${score} out of ${questionNumber}`;
      }else{
        response_dict.speech = `Correct! Do you want to go to the next question? current score: ${score} out of ${questionNumber}`;
      }
    }else{
      if (questionNumber === questions_per_exam){
        response_dict.contextOut[0].parameters.score = 0;
        response_dict.contextOut[0].parameters.questionNumber = 0;
        response_dict.speech = `Incorrect! The correct answer is: ${res} .You have finished the exam. Your score is ${score} out of ${questionNumber}`;
      }else{
        response_dict.speech = `Incorrect! The correct answer is: ${res} .Do you want to go to the next question? current score: ${score} out of ${questionNumber}`;
      }
    }
    console.log("resp2_par:" , response_dict.contextOut[0].parameters);
    console.log("resp2_score:" , response_dict.contextOut[0].parameters.score);
    console.log("resp2_questionNumber:" , response_dict.contextOut[0].parameters.questionNumber);
  }
  function sendFollowUpEvent(eventName){
    response.send({
      followupEvent: {
        name: eventName,
        parameters: {
          "score": parseInt(params.score),
          "questionNumber": parseInt(params.questionNumber)
        }
      },
    });
  }
  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function sum(x, y){return x + y}
  function subtract(x, y){return x - y}
  function multiply(x, y){return x * y}
  function divide(x, y){return x / y}
  function square(x) { return Math.pow(x,2)}
  function root(x) { return Math.sqrt(x)}
  function circle_area(radius) { return 3.14159*Math.pow(radius, 2)}
  function triangle_area(base, height) { return base*height/2}
  function square_area(side) { return Math.pow(side, 2)}
  function pentagon_area(side) { return 1.720477*Math.pow(side,2)}
  function hexagon_area(side) { return 2.598*Math.pow(side,2)}
  function send(){
    response.send({
      speech:
      "The result is " + numbers
    });}
  });
