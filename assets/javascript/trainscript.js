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

  firebase.initializeApp(config);

var database = firebase.database();

//1a.)How in the $%&* are you displaying some trains pre loaded?????? check out how to pre fill database???

    //2) Now make that dang submit button work. Again remember you've done this check  the above hw lines 25-33

    $("#submit-btn").on("click", function(event) {
        event.preventDefault();
      
        // Grabs user input
        var trainName = $("#trainName-input").val().trim();
        var trainDest = $("#dest-input").val().trim();
        var trainStart = moment($("#startTime-input").val().trim(), "HH:mm").format("????????");
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

    //3) Now Get those useless added trains back from firebase,

    //3a) Annnnd now that you've got them put display that LOUD and PROUD!!!

//4) If you make it this far know its soo all down hill from here Stop and Breathe! ^.^

//5) This is where the big Moment.js comes in time to create a way to calculate time till the next train arives
// Starting with the first arrival time in Militry Time, 
//add the Frequency in Miniutes to 
//display the Time Remaining in Miniutes till the next train arrives 