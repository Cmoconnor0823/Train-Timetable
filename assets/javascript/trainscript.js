
//1) Initalize fire base

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
var trains = {};
var scheduleLoaded = false;

$(document).ready(function () {
  console.log("What's up Doc!");

  //1a.) Get that train table ready before we start adding routes!
  var table = document.getElementById("train-table");
  var tableBody = table.tBodies[0];

  if (!tableBody) {
    tableBody = table.createTBody();
  }

  var submitButton = document.getElementById("submit-btn");
  var form = submitButton.form;

  // Keep our messages on the page so nobody misses what happened.
  var message = document.createElement("p");
  message.setAttribute("role", "status");
  message.setAttribute("aria-live", "polite");
  form.appendChild(message);

  function showMessage(text, isError) {
    message.textContent = text;
    message.style.color = isError ? "#a01818" : "#155724";
  }

  function showTableMessage(text) {
    tableBody.replaceChildren();

    var cell = tableBody.insertRow().insertCell();
    cell.colSpan = 5;
    cell.textContent = text;
  }

  //2) Starting with the first arrival time in Military Time,
  // add the Frequency in Minutes to find the next train.
  // Each day's schedule starts at the First Train Time.
  function calculateArrival(firstTime, frequency, currentTime) {
    var timeParts = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(firstTime);
    var trainFrequency = Number(frequency);

    if (
      !timeParts ||
      !Number.isInteger(trainFrequency) ||
      trainFrequency < 1 ||
      trainFrequency > 1440
    ) {
      return null;
    }

    var firstArrival = new Date(currentTime);
    firstArrival.setHours(
      Number(timeParts[1]),
      Number(timeParts[2]),
      0,
      0
    );

    var frequencyInMilliseconds = trainFrequency * 60000;
    var timePassed = currentTime.getTime() - firstArrival.getTime();

    // If the first train has not arrived yet, start there!
    var departures = Math.max(
      0,
      Math.ceil(timePassed / frequencyInMilliseconds)
    );

    var nextArrival = new Date(
      firstArrival.getTime() +
      departures * frequencyInMilliseconds
    );

    // If today's service is over, use tomorrow's first train.
    var tomorrow = new Date(firstArrival);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (nextArrival >= tomorrow) {
      nextArrival = new Date(firstArrival);
      nextArrival.setDate(nextArrival.getDate() + 1);
    }

    var minutesAway = Math.max(
      0,
      Math.ceil(
        (nextArrival.getTime() - currentTime.getTime()) / 60000
      )
    );

    return {
      nextArrival: nextArrival.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }),
      minutesAway: minutesAway
    };
  }

  //3) Annnnd now that you've got them, display those trains
  // LOUD and PROUD!!!
  function displayTrains() {
    if (!scheduleLoaded) {
      return;
    }

    tableBody.replaceChildren();

    var trainList = Object.values(trains).filter(function (train) {
      return train && typeof train === "object";
    });

    if (trainList.length === 0) {
      showTableMessage("No Train Routes have been added yet.");
      return;
    }

    var currentTime = new Date();

    trainList.forEach(function (train) {
      var arrival = calculateArrival(
        String(train.start || ""),
        train.frequency,
        currentTime
      );

      var row = tableBody.insertRow();

      var trainInfo = [
        train.name || "Train Name not provided",
        train.dest || "Destination not provided",
        train.frequency || "Not provided",
        arrival ? arrival.nextArrival : "Check First Train Time",
        arrival ? arrival.minutesAway : "Check Train Schedule"
      ];

      trainInfo.forEach(function (value) {
        row.insertCell().textContent = String(value);
      });
    });
  }

  //3a.) Display the trains on page load.
  // Listen for changes so the table stays up to date.
  showTableMessage("Loading Train Routes...");

  // A disconnected database might not immediately report an error.
  var loadingTimer = setTimeout(function () {
    if (!scheduleLoaded) {
      showTableMessage(
        "Train schedule is taking longer than expected to load."
      );
      showMessage(
        "Still waiting for Firebase. Please check your connection.",
        true
      );
    }
  }, 15000);

  database.ref().on(
    "value",
    function (snapshot) {
      clearTimeout(loadingTimer);

      var firstLoad = !scheduleLoaded;
      trains = snapshot.val() || {};
      scheduleLoaded = true;

      displayTrains();

      if (firstLoad) {
        showMessage("Train schedule loaded successfully.", false);
      }
    },
    function (error) {
      clearTimeout(loadingTimer);
      scheduleLoaded = false;

      showTableMessage("Train schedule could not be loaded.");
      showMessage(
        "Train schedule could not be loaded. Please try again.",
        true
      );

      console.error("Train schedule needs attention:", error);
    }
  );

  //3b.) Keep those arrival times current!
  // Update the table without refreshing the whole page.
  setInterval(displayTrains, 30000);

  //4) Now make that submit button work!
  // Listen to the form so pressing Enter works too.
  form.addEventListener("submit", async function (event) {
    event.preventDefault();

    if (submitButton.disabled) {
      return;
    }

    // Grabs user input.
    var trainName =
      document.getElementById("trainName-input").value.trim();

    var trainDest =
      document.getElementById("dest-input").value.trim();

    var trainStart =
      document.getElementById("startTime-input").value.trim();

    var trainFreq = Number(
      document.getElementById("frequency-input").value.trim()
    );

    //4a.) Check your work before sending those trains off!
    if (!trainName || !trainDest) {
      showMessage(
        "Please enter a Train Name and Destination.",
        true
      );
      return;
    }

    if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(trainStart)) {
      showMessage(
        "Please enter the First Train Time in HH:mm format.",
        true
      );
      return;
    }

    if (
      !Number.isInteger(trainFreq) ||
      trainFreq < 1 ||
      trainFreq > 1440
    ) {
      showMessage(
        "Please enter the Frequency as a whole number from 1 to 1440 minutes.",
        true
      );
      return;
    }

    // Store everything in an object.
    var newTrain = {
      name: trainName,
      dest: trainDest,
      start: trainStart,
      frequency: trainFreq
    };

    //5) Now stick those trains in your database!!!
    // Wait for Firebase to confirm before saying it worked.
    submitButton.disabled = true;
    showMessage("Adding your new Train Route...", false);

    var savingTimer = setTimeout(function () {
      showMessage(
        "Still waiting for Firebase to confirm your Train Route. " +
        "Please don't submit it again yet.",
        true
      );
    }, 15000);

    try {
      await database.ref().push(newTrain);

      // Nice touch: clear the form only after a successful save!
      form.reset();

      showMessage(
        "New Train Route successfully added",
        false
      );

      // The database listener above will update the table for us.
    } catch (error) {
      var permissionDenied = /permission/i.test(
        String(error.code || "") + " " + String(error.message || "")
      );

      if (permissionDenied) {
        showMessage(
          "Train Route could not be added. " +
          "Saving is currently disabled for this demo.",
          true
        );
      } else {
        showMessage(
          "Train Route could not be added. Please try again.",
          true
        );
      }

      console.error("Train Route needs attention:", error);
    } finally {
      clearTimeout(savingTimer);
      submitButton.disabled = false;
    }
  });
});