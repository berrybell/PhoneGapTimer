// Helper functions
function pad(number, length) {
  var str = "" + number;
  while (str.length < length) {
    str = "0" + str;
  }
  return str;
}

function stringToMs(time) {
  var min = parseInt(time / 6000),
    sec = parseInt(time / 100) - min * 60,
    hundredths = pad(time - sec * 100 - min * 6000, 2);
  return (min > 0 ? pad(min, 2) : "00") + ":" + pad(sec, 2) + ":" + hundredths;
}

function msToString(s) {
  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;

  return pad(hrs, 2) + ":" + pad(mins, 2) + ":" + pad(secs, 2);
}

function showCurrentTime(timer) {
  return timer.getTimeValues().toString();
}
