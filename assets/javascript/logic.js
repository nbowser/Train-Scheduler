  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyDtxp3OdpyGD7YKqnzWluukQBP0i8ybO4Q",
    authDomain: "homework-train-scheduler.firebaseapp.com",
    databaseURL: "https://homework-train-scheduler.firebaseio.com",
    projectId: "homework-train-scheduler",
    storageBucket: "homework-train-scheduler.appspot.com",
    messagingSenderId: "251110739789"
  };
  firebase.initializeApp(config);



  // Variables
  var database = firebase.database();

  var trainName = "";
  var destination = "";
  var firstTrainTime = "";
  var frequency = 0;


  // Functions---------------------------------------------------------------------//

  // Listen for button click
  $("#addTrain").on("click", function (event) {
    // Prevent auto-refresh to page
    event.preventDefault();    

    // Code in the logic for storing and retrieving the most recent user data
    trainName = $('#nameInput').val().trim();
    destination = $('#destinationInput').val().trim();
    firstTrainTime = $('#firstTrainInput').val().trim();
    frequency = $('#frequencyInput').val().trim();
    
    // Clear the textbox after clicking submit
    $("#nameInput").val("");
    $("#destinationInput").val("");
    $("#firstTrainInput").val("");
    $("#frequencyInput").val("");


    // console.log(trainName);
    // console.log(destination);
    // console.log(firstTrainTime);
    // console.log(frequency);

    // Provide initial data to Firebase database
    database.ref().push({
      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });

    // return false;
  });


  // Firebase watcher and initial loader
  database.ref().on("child_added", function (childSnapshot) {

      // Log everything that's coming out of snapshot
      console.log(childSnapshot.val());
      console.log(childSnapshot.val().trainName);
      console.log(childSnapshot.val().destination);
      console.log(childSnapshot.val().firstTrainTime);
      console.log(childSnapshot.val().frequency);


      // Update the variable with data from the database
      trainName = childSnapshot.val().trainName;
      destination = childSnapshot.val().destination;
      firstTrainTime = childSnapshot.val().firstTrainTime;
      frequency = childSnapshot.val().frequency;


      // Moment.js time calculations
      var firstTrainMoment = moment(firstTrainTime, 'HH:mm');
      // Creates a moment object of current date/time and storing value in the variable when button clicked
      var nowMoment = moment();

      var minutesSinceFirstArrival = nowMoment.diff(firstTrainMoment, 'minutes');
      var minutesSinceLastArrival = minutesSinceFirstArrival % frequency;
      var minutesAway = frequency - minutesSinceLastArrival;

      var nextArrival = nowMoment.add(minutesAway, 'minutes');
      var formatNextArrival = nextArrival.format("HH:mm");


      // Create table in html document
      var tr = $('<tr>');
      var a = $('<td>');
      var b = $('<td>');
      var c = $('<td>');
      var d = $('<td>');
      var e = $('<td>');
      a.append(trainName);
      b.append(destination);
      c.append(frequency);
      d.append(formatNextArrival);
      e.append(minutesAway);
      tr.append(a).append(b).append(c).append(d).append(e);
      $('#newTrains').append(tr);
    },
    
    // Error handling
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
  });