/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// On load
$(document).on("pagecreate", function() {
  $(document).on("pagecontainershow", function() {
    $(".ui-content").height(getRealContentHeight());
  });

  $(window).on("resize orientationchange", function() {
    $(".ui-content").height(getRealContentHeight());
  });

  function getRealContentHeight() {
    var activePage = $.mobile.pageContainer.pagecontainer("getActivePage"),
      screen = $.mobile.getScreenHeight(),
      header = $(".ui-header").hasClass("ui-header-fixed")
        ? $(".ui-header").outerHeight() - 1
        : $(".ui-header").outerHeight(),
      footer = $(".ui-footer").hasClass("ui-footer-fixed")
        ? $(".ui-footer").outerHeight() - 1
        : $(".ui-footer").outerHeight(),
      contentMargins =
        $(".ui-content", activePage).outerHeight() -
        $(".ui-content", activePage).height();
    var contentHeight = screen - header - footer - contentMargins;

    return contentHeight;
  }
});

var app = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },
  // Bind Event Listeners
  //
  // Bind any events that are required on startup. Common events are:
  // 'load', 'deviceready', 'offline', and 'online'.
  bindEvents: function() {
    document.addEventListener("deviceready", this.onDeviceReady, false);
  },
  // deviceready Event Handler
  //
  // The scope of 'this' is the event. In order to call the 'receivedEvent'
  // function, we must explicitly call 'app.receivedEvent(...);'
  onDeviceReady: function() {
    app.receivedEvent("deviceready");
    console.log(navigator.vibrate);
    console.log(navigator.notification);
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {}
};

app.initialize();

var vibroLength = 1000;
var beeps = 2;

// Common functions
function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}
function formatTime(time) {
  var min = parseInt(time / 6000),
    sec = parseInt(time / 100) - min * 60,
    hundredths = pad(time - sec * 100 - min * 6000, 2);
  return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}

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
    var durInMs = durArray[0] * 360000 + durArray[1] * 6000 + durArray[2] * 100;

    var timer = { name: newTimerName, length: durInMs };
    console.log("Timer: " + timer);

    localStorage.setItem("name", newTimerName);
    localStorage.setItem("length", durInMs);
    //var retrievedTimer = localStorage.getItem('A');
    //console.log(JSON.parse(retrievedTimer));

    $("#readyTimers").append(
      "<p class='timer'><b>Name: </b>" +
        timer.name +
        "<br><b>Duration: </b>" +
        newTimerDur +
        "<button type='button' class='startTimer ui-btn ui-btn-inline'>Start</button><button type='button' class='removeTimer ui-btn ui-btn-inline'>Remove</button></p>"
    );
  }
});

//Hides entry form
$(document).ready(function() {
  $("#addTimer").hide();
});

$("#addButton").click(function() {
  $("#addTimer").toggle();
});

//Remove all timers
$("#removeButton").click(function() {
  localStorage.clear();
  $("#readyTimers").empty();
  alert("All timers removed");
});

//Moves timer to Active page
$(document).on("click", ".startTimer", function() {
  alert("Ready to start timer");
  $(this)
    .siblings()
    .remove();
  $(this)
    .parent()
    .append(
      "<button type='button' class='ui-btn ui-btn-inline' onclick='exCountdown.Timer.toggle();'>Play/Pause</button><button type='button' value='Stop/Reset' class='ui-btn ui-btn-inline' onclick='exCountdown.resetCountdown();'>Reset</button>"
    );
  $(this)
    .parent()
    .clone()
    .appendTo("#activeTimers");
  $(this)
    .parent()
    .remove();
  $("#timerName").text(localStorage.getItem("name"));
  //$("#countdown").text(localStorage.getItem(length));
});

$(document).on("click", ".removeTimer", function() {
  $(this)
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

// Helper for current timer value
function showCurrentTime(timer) {
  return timer.getTimeValues().toString();
}
