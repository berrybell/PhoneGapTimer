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

//Check if vibration is on and show/hide length
function checkVibrate() {
  var vibrateOn = $("#vibrate input[type='radio']:checked").val();
  if (vibrateOn === "true") {
    $("#vibration-length--wrapper").show();
  } else $("#vibration-length--wrapper").hide();
}

// Set vibration length
function setVibrateLength() {
  vibroLength = $("#vibration-length").val();
}

function setBeeps() {
  beeps = Number($("#beeps").val());
}

function alertDismissed() {
  //TODO: do something
  console.log("Alert dismissed");
}
