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
