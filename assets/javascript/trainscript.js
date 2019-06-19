//****Remember now BABY STEPS!!!!! I WANNA SEE PSUDO CODING!!!! 
//AND FOR THE LOVE OF YOUR SANITY I WANNA SEE Console.log EVERYWHERE! */

//1) Initalize fire base-- phsh easy peasy check out hw 17 line 10 -19 for reference ok?

var firebaseConfig = {
  apiKey: "AIzaSyAc4NFhmNxHmSP_LpIDhfzY1QUh9Br6SuY",
  authDomain: "trainhomework-fa102.firebaseapp.com",
  databaseURL: "https://trainhomework-fa102.firebaseio.com",
  projectId: "trainhomework-fa102",
  storageBucket: "trainhomework-fa102.appspot.com",
  messagingSenderId: "529292222769",
  appId: "1:529292222769:web:344bd715145c970e"
};

firebase.initializeApp(firebaseConfig);

var database = firebase.database();

//1a.)How in the $%&* are you displaying some trains pre loaded?????? check out how to pre fill database???

//2) Now make that dang submit button work. Again remember you've done this check  the above hw lines 25-33

$("#submit-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var trainName = $("#trainName-input").val().trim();
  var trainDest = $("#dest-input").val().trim();
  var trainStart = moment($("#startTime-input").val().trim(), "HH:mm").format("x"); //x here converts time to a uinx code
  var trainFreq = $("#frequency-input").val().trim();

  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    frequency: trainFreq
  };

  //2a) Now stick those trains in an object in your database!!! Check your work!! (nice touch clear form fill afterwards)

  // Uploads Train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.dest);
  console.log(newTrain.start);
  console.log(newTrain.frequency);

  alert("New Route successfully added");

  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#dest-input").val("");
  $("#startTime-input").val("");
  $("#frequency-input").val("");

});

//3) Now Get those useless added trains back from firebase,
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var trainName = childSnapshot.val().name;
  var trainDest = childSnapshot.val().dest;
  var trainStart = childSnapshot.val().start;
  var trainFreq = childSnapshot.val().frequency;

  // Employee Info
  console.log(trainName);
  console.log(trainDest);
  console.log(trainStart);
  console.log(trainFreq);
  //5--found out during coding this should be step 3) This is where the big Moment.js comes in time to create a way to calculate time till the next train arives
  // Starting with the first arrival time in Militry Time, 
  //add the Frequency in Miniutes to 
  //display the Time Remaining in Miniutes till the next train arrives

  // train frequency from database call
  var tFrequency = trainFreq;

  // start time from database call
  var firstTime = trainStart;
  console.log("Train start time " + trainStart)

  // First Time (pushed back 1 year to make sure it comes before current time)
  var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
  console.log( "firstTimeConverted: "+ firstTimeConverted);

  // Current Time
  var currentTime = moment();
  console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

  // Difference between the times
  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
  console.log("DIFFERENCE IN TIME: " + diffTime);

  // Time apart (remainder)
  var tRemainder = diffTime % tFrequency;
  console.log(tRemainder);

  // Minute Until Train
  var trainMinAway = tFrequency - tRemainder;
  console.log("MINUTES TILL TRAIN: " + trainMinAway);

  // Next Train
  var trainArrival = moment().add(trainMinAway, "minutes");
  console.log("ARRIVAL TIME: " + moment(trainArrival).format("hh:mm"));


  //3a) Annnnd now that you've got them put display that LOUD and PROUD!!!


  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(trainName),
    $("<td>").text(trainDest),
    $("<td>").text(trainFreq),
    $("<td>").text(trainArrival),
    $("<td>").text(trainMinAway),
  );

  // Append the new row to the table
  $("#train-table > tbody").append(newRow);

  //4) If you make it this far know its soo all down hill from here Stop and Breathe! ^.^

});