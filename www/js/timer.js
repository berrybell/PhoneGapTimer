//Global variables
var vibroLength = 1000;
var beeps = 2;
var timers = [];

//Main timer script
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

const buttons =
  "<div><button type='button' class='activateTimer ui-btn ui-btn-inline'>Activate</button><button type='button' class='removeTimer ui-btn ui-btn-inline'>Remove</button></div></div>";

//Create timer div
function createTimer(timer) {
  $("#readyTimers").append(
    "<div class='timer'><b>Name: </b>" +
      timer.name +
      "<br><b>Duration: </b><span class='timerValue'>" +
      msToString(timer.length) +
      "</span>" +
      buttons
  );
  $("#readyTimers")
    .children()
    .last()
    .data({ name: timer.name, dur: timer.length });
}

function toggleAddTimer() {
  $("#addTimer").toggle();
}

function removeAllTimers() {
  localStorage.clear();
  timers.length = 0;
  $("#readyTimers").empty();
  navigator.notification.alert(
    "All timers removed",
    function() {},
    "Ready!",
    "OK"
  );
}

//Moves timer to Active page
function activateTimer() {
  navigator.notification.alert("Ready to start timer", function() {});
  var timerDiv = $(this)
    .parent()
    .parent();
  console.log(timerDiv.data());
  $(this)
    .siblings()
    .remove();
  $(this)
    .parent()
    .append(
      "<form><button type='button' class='ui-btn ui-btn-inline startButton'>Start</button><button type='button' class='ui-btn ui-btn-inline pauseButton'>Pause</button><button type='button' class='ui-btn ui-btn-inline stopButton'>Stop</button><button type='button' class='ui-btn ui-btn-inline resetButton'>Reset</button> <button type='button' class='ui-btn ui-btn-inline deactivateButton'>Deactivate</button></form>"
    );
  $(this).remove();
  timerDiv.detach().appendTo("#activeTimers");
  // $("#timerName").text(localStorage.getItem("name"));
  //$("#countdown").text(localStorage.getItem(length));
}
//Moves unused timers to All
function deactivateTimer() {
  var timerDiv = $(this)
    .parent()
    .parent()
    .parent();

  $(this)
    .parent()
    .parent()
    .append(
      "<button type='button' class='activateTimer ui-btn ui-btn-inline'>Activate</button><button type='button' class='removeTimer ui-btn ui-btn-inline'>Remove</button></p>"
    );
  timerDiv.detach().appendTo("#readyTimers");
  $(this)
    .parent()
    .remove();
}

function startTimer() {
  //This is necessary so that click only affects the necessary timer
  var startButton = $(this);
  var pauseButton = $(this).siblings(".pauseButton");
  var stopButton = $(this).siblings(".stopButton");
  var resetButton = $(this).siblings(".resetButton");
  var timerDiv = $(this)
    .parent()
    .parent()
    .parent();

  var timer = new easytimer.Timer();
  timer.start({
    countdown: true,
    startValues: { seconds: timerDiv.data("dur") / 1000 }
  });

  startButton.attr("disabled", "true");

  timer.addEventListener("secondsUpdated", function(e) {
    updateTimerTime(timerDiv, timer);
  });
  timer.addEventListener("started", function(e) {
    updateTimerTime(timerDiv, timer);
  });
  timer.addEventListener("targetAchieved", function(e) {
    startButton.removeAttr("disabled");
    navigator.vibrate(vibroLength);
    console.log("Vibrated for" + vibroLength);
    navigator.notification.alert(
      timerDiv.data("name") + " finished!",
      function() {}
    );
    navigator.notification.beep(beeps);
  });
  timer.addEventListener("reset", function(e) {
    updateTimerTime(timerDiv, timer);
  });

  pauseButton.click(function() {
    if (timer.isPaused()) {
      timer.start();
      pauseButton.html("Pause");
    } else {
      timer.pause();
      pauseButton.html("Continue");
    }
  });
  stopButton.click(function() {
    timer.stop();
    updateTimerTime(timerDiv, timer);
    resetButtonState(startButton, pauseButton);
  });
  resetButton.click(function() {
    timer.reset();
    updateTimerTime(timerDiv, timer);
  });
}

function removeTimer() {
  var timerToRemove = $(this)
    .parent()
    .parent()
    .data();
  timers = timers.filter(
    id => !(id.name === timerToRemove.name && id.length === timerToRemove.dur)
  );
  localStorage.setItem("timers", JSON.stringify(timers));
  $(this)
    .parent()
    .parent()
    .remove();
}

function updateTimerTime(timerDiv, timer) {
  timerDiv.children(".timerValue").html(showCurrentTime(timer));
}

function resetButtonState(startButton, pauseButton) {
  startButton.removeAttr("disabled");
  pauseButton.html("Pause");
}

//Event listeners
$("#addButton").click(toggleAddTimer);
$("#removeAllButton").click(removeAllTimers);
$(document).on("click", ".activateTimer", activateTimer);
$(document).on("click", ".startButton", startTimer);
$(document).on("click", ".removeTimer", removeTimer);
$(document).on("click", ".deactivateButton", deactivateTimer);
