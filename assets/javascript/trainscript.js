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

var database = firebase.database();//
var keys = [];//
var freqs = [];//
var textArr = [];//
var tableArr = [];//

//1a.)How in the $%&* are you displaying some trains pre loaded?????? check out how to pre fill database???
$(document).ready(function () {
  console.log("What's up Doc!");

  var query = firebase.database().ref().orderByKey();

  query.once("value")
    .then(function (snapshot) {
      snapshot.forEach(function (childSnapshot) {

        // childData will be the actual contents of the child
        var childData = childSnapshot.val();
        //console.log(childData);
        tableArr.push(childData);
        //console.log(tableArr);
        JSON.stringify(tableArr);

        for (var i = 0; i < tableArr.length; i++) {
          var trainName = tableArr[i].name;
          var trainDest = tableArr[i].dest;
          var trainStart = tableArr[i].start;
          var trainFreq = tableArr[i].frequency;
          var trainArrival = tableArr[i].nextArrival;
          var trainMinAway = tableArr[i].minutesAway;
          // Train Info
          //console.log(trainName);
          //console.log(trainDest);
          //console.log("train Start" + trainStart);
          //console.log(trainFreq);
          //console.log(trainArrival);
          //console.log(trainMinAway);
        }

        //5--found out during coding this should be step 3) then repeated again for new trains in step 5)
        // Starting with the first arrival time in Militry Time, 
        //add the Frequency in Miniutes to 
        //display the Time Remaining in Miniutes till the next train arrives

        var tFrequency = trainFreq;
        //console.log("train frequency" + tFrequency)

        // start time from database call
        var firstTime = trainStart;
        //console.log("Train start time " + trainStart)

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        //console.log("firstTime: " + firstTime)
        //console.log("firstTimeConverted: " + firstTimeConverted);

        // Current Time
        var currentTime = moment();
        //console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        //console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        //console.log(tRemainder);

        // Minute Until Train Arrives
        var trainMinAway = tFrequency - tRemainder;
        //console.log("MINUTES TILL TRAIN: " + trainMinAway);

        // Next Train
        var trainArrival = moment().add(trainMinAway, "minutes");
        //console.log("ARRIVAL TIME: " + moment(trainArrival).format("hh:mm"));
        var newArrival = moment(trainArrival).format("HH:mm;");
        //console.log(trainMinAway);

        //3a) Annnnd now that you've got them put display that LOUD and PROUD!!!
        var table = $("<tbody>")
        table.attr("id", tableArr[i]);
        // Create the new row
        // var newRow = table.append(
        //   $("<td>").text(trainName),
        //   $("<td>").text(trainDest),
        //   $("<td>").text(trainFreq),
        //   $("<td>").text(trainArrival),
        //   $("<td>").text(trainMinAway),
        // );
        // Append the new row to the table
        $("#train-table > tbody").append(
          $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(trainDest),
            $("<td>").text(trainFreq),
            $("<td>").text(newArrival),
            $("<td>").text(trainMinAway),
          )
        );
      })
    })

  setTimeout(function () {
    location.reload();
  }, 600000);
});

//Revision make the submit button work only once the document loads
//2) Now make that dang submit button work. Again remember you've done this check  the above hw lines 25-33

$('#submit-btn').on("click", function (event) {
  event.preventDefault();
  keys = [];
  frequency = [];
  textArr = [];
  // console.log(frequency);
  //console.log(textArr);

  // Grabs user input
  var trainName = $("#trainName-input").val().trim();
  var trainDest = $("#dest-input").val().trim();
  var trainStart = $("#startTime-input").val().trim() //x here converts time to a uinx code
  var trainFreq = $("#frequency-input").val().trim();

  // Store everything into a variable.
  var newTrain = {
    name: trainName,
    dest: trainDest,
    start: trainStart,
    frequency: trainFreq,
  };


  //2a) Now stick those trains in an object in your database!!! Check your work!! (nice touch clear form fill afterwards)

  // Uploads Train data to the database
  // console.log('train push')
  database.ref().push(newTrain);

  // // Logs everything to console
  // console.log(newTrain.name);
  // console.log(newTrain.dest);
  // console.log(newTrain.start);
  // console.log(newTrain.frequency);
  // console.log("new train min array" + newTrain.trainMinAway);
  // console.log(newTrain.nextArrival);

  alert("New Train Route successfully added");

  // Clears all of the text-boxes
  $("#trainName-input").val("");
  $("#dest-input").val("");
  $("#startTime-input").val("");
  $("#frequency-input").val("");

  //4) If you make it this far know its soo all down hill from here Stop and Breathe! ^.^
  // 4)train table database call

  database.ref().endAt().limitToLast(1).on("child_added", function (childSnapshot) {

    console.log(childSnapshot + "childSnapshot");
    console.log(childSnapshot.key)
    // Store everything into a variable.
    var ftTime = childSnapshot.val().start;
    var freq = childSnapshot.val().frequency;
    var key = childSnapshot.key

    console.log(key);
    // Train Info
    console.log(ftTime);
    console.log(freq);

    keys.push(key);
    freqs.push(ftTime, freq)

    console.log(keys);
    console.log(freqs);



    var newRef = database.ref(keys[0]);
    console.log(newRef)
    var tFrequency = freqs[1];
    var firstTime = freqs[0];
    console.log(tFrequency);
    console.log(firstTime);

    //5--found out during coding this should be step 3) then repeated again for new trains in step 5)

    // This is where the big Moment.js comes in time to create a way to calculate time till the next train arives
    // Starting with the first arrival time in Militry Time, 
    //add the Frequency in Miniutes to 
    //display the Time Remaining in Miniutes till the next train arrives

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log("firstTimeConverted: " + firstTimeConverted);

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
    var nextArrival = moment(trainArrival).format("HH:mm;");
    console.log(trainMinAway);
     newRef.update({
     
      nextArrival: moment(trainArrival).format("HH:mm")
    });
    console.log("new arrival end" +nextArrival);

     newRef.update({
        minutesAway: trainMinAway
     });

    console.log("new reference check");

    newRef.once("value")
      .then(function (snapshot) {
        var destination = snapshot.child("dest").val();
        var frequency = snapshot.child("frequency").val();
        var trainName = snapshot.child("name").val();

        //these dont grab anything worth a damn
        var nextArrival = snapshot.child("nextArrival").val();
        console.log("nextarrival " +nextArrival)
        var minutesAway = snapshot.child("trainMinAway").val();
        console.log("trainMinAway " + trainMinAway)
        console.log("minutesAway"+ minutesAway )

        ///I cannot for the life of me get the calculated time to isplay on submit. it calculates just fine just wont print to page

        textArr.push(trainName, destination, frequency, nextArrival, minutesAway);
        console.log("textarr"+textArr)


        //3a) Annnnd now that you've got them update that display with your new calculating trains LOUD and PROUD!!!

        var table = $("<tbody>")
        table.attr("id", keys[0]);
        $("#train-table > tbody").append(
          $("<tr>").append(
          $("<td>").text(textArr[0]),
          $("<td>").text(textArr[1]),
          $("<td>").text(textArr[2]),
          $("<td>").text(textArr[3]),
          $("<td>").text(textArr[4]),
          )
        );
        // Append the new row to the table
        

      });

  });

});
