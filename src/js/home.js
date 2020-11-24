/*
** MyPomodoro.  A simply pomodoro countdown timer.
** Copyright (C) 2020  Andŕes Felipe Moreno Sarria
**
** This program is free software: you can redistribute it and/or modify
** it under the terms of the GNU General Public License as published by
** the Free Software Foundation, either version 3 of the License, or
** (at your option) any later version.
**
** This program is distributed in the hope that it will be useful,
** but WITHOUT ANY WARRANTY; without even the implied warranty of
** MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
** GNU General Public License for more details.
**
** You should have received a copy of the GNU General Public License
** along with this program.  If not, see <https://www.gnu.org/licenses/>.
**/

const {ipcRenderer} = require("electron");
const fs = require("fs-extra");

// The timer division.
var timerDiv = document.getElementById("Timer");
var timer;

// The buttons.
var startButton = document.getElementById("Start");
var resetButton = document.getElementById("Reset");
var configButton = document.getElementById("Config");

/**
* This function update the timer.
*
* @param {int} time The value for the timer in milliseconds.
*/
function updatePomodoroTimer(time) {
  // Convert the time integer into minutes and seconds.
  var minutes;
  if (time < 60 * 60 * 1000) {
    minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  } else {
    minutes = 60;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  var seconds = Math.floor((time % (1000 * 60)) / 1000);

  if (seconds < 10) {
    seconds = "0" + seconds;
  }

  // Set the new timer value;
  timerDiv.innerText = minutes + ":" + seconds;
}

/**
* This function reset the timer.
*
* @param {str} file The configuration file.
*/
function resetPomodoroTimer(file) {
  // Read the configuration file.
  fs.readJson(file, (err, configObj) => {
    if (err) {
      throw err;
    }

    updatePomodoroTimer(configObj.work * 60 * 1000);
  });
}

// Add events for the buttons
// Get all delete buttons of the table.
var buttons = document.getElementsByClassName("button");

// Add an event to the delete buttons.
for (var button of buttons) {
  button.addEventListener("click", (event) => {
    var parNode = event.target.id;
    console.log(parNode);
    ipcRenderer.send(parNode);
  });
}

// This event reset the timer.
ipcRenderer.on("RESET", (event, value) => {
  clearInterval(timer);
  resetPomodoroTimer(value);
});

ipcRenderer.send("RESET");
