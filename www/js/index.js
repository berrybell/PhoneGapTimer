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

  //Hides entry form on start
  $(document).ready(function() {
    $("#addTimer").hide();
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

    if (localStorage.getItem("timers") !== null) {
      timers = JSON.parse(localStorage.getItem("timers"));
      timers.forEach(timer => createTimer(timer));
    }
  },
  // Update DOM on a Received Event
  receivedEvent: function(id) {}
};

app.initialize();
