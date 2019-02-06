//Global variables
var vibroLength = 1000;
var beeps = 2;
var timers = [];

// Main timer script

//Adding the timer
$("#addTimer").validate({
  rules: {
    dur: { required: true }
  },
  messages: {
    dur: { required: "Please enter time" }
  },
  submitHandler: function(form) {
    var newTimerName = document.getElementById("name").value;
    var newTimerDur = document.getElementById("dur").value;

    document.getElementById("addTimer").reset();

    var durArray = newTimerDur.split(":");
    var durInMs =
      durArray[0] * 3.6e6 + durArray[1] * 60000 + durArray[2] * 1000;

    var timer = { name: newTimerName, length: durInMs };
    timers.push(timer);
    localStorage.setItem("timers", JSON.stringify(timers));

    createTimer(timer);
  }
});

//Create timer div
function createTimer(timer) {
  $("#readyTimers").append(
    "<div class='timer'><b>Name: </b>" +
      timer.name +
      "<br><b>Duration: </b>" +
      msToString(timer.length) +
      "<div><button type='button' class='startTimer ui-btn ui-btn-inline'>Start</button><button type='button' class='removeTimer ui-btn ui-btn-inline'>Remove</button></div></div>"
  );
  $("#readyTimers")
    .children()
    .last()
    .data(timer);
}

//Hides entry form
$(document).ready(function() {
  $("#addTimer").hide();
});

$("#addButton").click(function() {
  $("#addTimer").toggle();
});

//Remove all timers
$("#removeAllButton").click(function() {
  localStorage.clear();
  timers.length = 0;
  $("#readyTimers").empty();
  alert("All timers removed");
});

//Moves timer to Active page
$(document).on("click", ".startTimer", function() {
  alert("Ready to start timer");
  var timerDiv = $(this)
    .parent()
    .parent();
  $(this)
    .siblings()
    .remove();
  $(this)
    .parent()
    .append(
      "<form><button type='button' class='ui-btn ui-btn-inline startButton'>Start</button><button type='button' class='ui-btn ui-btn-inline pauseButton'>Pause</button><button type='button' class='ui-btn ui-btn-inline stopButton'>Stop</button><button type='button' class='ui-btn ui-btn-inline resetButton'>Reset</button></form>"
    );
  timerDiv.clone().appendTo("#activeTimers");

  timerDiv.remove();
  // $("#timerName").text(localStorage.getItem("name"));
  //$("#countdown").text(localStorage.getItem(length));
});

$(document).on("click", ".removeTimer", function() {
  var timerToRemove = $(this)
    .parent()
    .parent()
    .data();
  timers = timers.filter(
    id =>
      !(id.name === timerToRemove.name && id.length === timerToRemove.length)
  );
  localStorage.setItem("timers", JSON.stringify(timers));
  $(this)
    .parent()
    .parent()
    .remove();
});

//Adding steps to timer
//$(document).on("click", "#addSteps", function(){
//	$(".addTimerField").clone().appendTo("input:last-of-type");
//});

//Multistep timer as JSON object
//var testTimer = { 'name': aaa, 'one': 1000, 'two': 2000, 'three': 3000 };
//Put object into storage
//localStorage.setItem('testTimer', JSON.stringify(testTimer));
//Retrieve the object from storage
//var retrievedTimer = localStorage.getItem('testTimer');

// Example timer
var exampleTimer = new Timer();

$("#exampleTimer .startButton").click(function() {
  exampleTimer.start({ countdown: true, startValues: { seconds: 5 } });
});
$("#exampleTimer .pauseButton").click(function() {
  exampleTimer.pause();
});
$("#exampleTimer .stopButton").click(function() {
  exampleTimer.stop();
});
$("#exampleTimer .resetButton").click(function() {
  exampleTimer.reset();
  exampleTimer.stop();
});

exampleTimer.addEventListener("secondsUpdated", function(e) {
  $("#exampleTimer #timerValue").html(showCurrentTime(exampleTimer));
});
exampleTimer.addEventListener("started", function(e) {
  $("#exampleTimer #timerValue").html(showCurrentTime(exampleTimer));
});
exampleTimer.addEventListener("targetAchieved", function(e) {
  $("#exampleTimer #timerValue").html("Done!");
  navigator.vibrate(vibroLength);
  console.log("Vibrated for" + vibroLength);
  navigator.notification.alert("Timer finished!", alertDismissed);
  navigator.notification.beep(beeps);
});
exampleTimer.addEventListener("reset", function(e) {
  $("#exampleTimer #timerValue").html(showCurrentTime(exampleTimer));
});

//Moving unused timers back to Save
//$("#active").on("click", ".removeTimer", function(){
//	$(this).parent().append("<button type='button' class='startTimer ui-btn ui-btn-inline'>Start</button><button type='button' class='removeTimer ui-btn ui-btn-inline'>Remove</button></p>");
//	$(this).parent().clone().appendTo("#readyTimers");
//	$(this).parent().remove();
//});