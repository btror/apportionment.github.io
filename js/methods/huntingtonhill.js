// The table.
var table = document.getElementById("tab_logic");

// Adds a new row to the table.
function addRow() {
  var row = table.insertRow(table.rows.length);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);

  cell0.innerHTML = table.tBodies[0].rows.length - 1;
  cell1.innerHTML = `<input type="number" id="population${
    table.rows.length - 2
  }" name="population" placeholder="Enter"/>`;
  cell2.innerHTML = `<p id="fairShare${table.rows.length - 2}">-</p>`;
  clearData();
}

// Removes the last row from the table.
function removeRow() {
  if (table.rows.length > 3) {
    table.deleteRow(table.rows.length - 1);
  }
  document.getElementById("output").innerText = "";
  clearData();
}

// Clears all rows from the table.
function resetTable() {
  for (var i = table.rows.length - 1; i > 2; i--) {
    table.deleteRow(i);
  }
  clearData();
  document.getElementById("population1").value = "";
  document.getElementById("output").innerText = "";
}

// Calculates the quotas, initial fair shares, final fair shares, and divisors for Equal Proportions method.
function calculate() {
  // Get the number of seats to apportion.
  var seats = document.getElementById("seats").value;

  if (seats == "") {
    clearData();
    alert("Please enter a number of seats to apportion.");
  } else if (seats < 1) {
    clearData();
    alert("Please enter an amount of seats greater than 0.");
  } else {
    // Get the populations from the table.
    var validInput = true;
    var positiveNumber = true;
    var populations = [];

    // Get the populations from the table.
    var populations = [];
    for (var i = 0; i < table.rows.length - 2; i++) {
      if (document.getElementById(`population${i + 1}`).value == "") {
        validInput = false;
      }
      if (document.getElementById(`population${i + 1}`).value < 0) {
        positiveNumber = false;
      }
      populations[i] = document.getElementById(`population${i + 1}`).value;
    }

    if (!validInput && positiveNumber) {
      clearData();
      alert("Empty population field detected. Fill out all fields.");
    } else if (validInput && !positiveNumber) {
      clearData();
      alert("Population fields must have a number greater than or equal to 0.");
    } else {
      // Set the fair shares to 1. Each state gets one seat by default.
      var fairShares = [];
      for (var i = 0; i < table.rows.length - 2; i++) {
        fairShares[i] = 1;
      }

      // Priority numbers.
      var priorityNumbers = [];
      for (var i = 0; i < table.rows.length - 2; i++) {
        priorityNumbers[i] =
          populations[i] / Math.sqrt(fairShares[i] * (fairShares[i] + 1));
      }

      // Start apportionment.
      while (
        fairShares.reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0) != seats
      ) {
        for (var i = 0; i < table.rows.length - 2; i++) {
          priorityNumbers[i] =
            populations[i] / Math.sqrt(fairShares[i] * (fairShares[i] + 1));
        }
        var highestPriority = Math.max.apply(Math, priorityNumbers);
        var index = priorityNumbers.indexOf(highestPriority);
        fairShares[index] += 1;
      }
      for (var i = 0; i < table.rows.length - 2; i++) {
        document.getElementById(`fairShare${i + 1}`).innerText = fairShares[i];
      }
      document.getElementById("output").innerText = `Divisor is ${
        Math.round(initialDivisor * 10000) / 10000
      }`;
    }
  }
}

function clearData() {
  for (var i = 0; i < table.rows.length - 2; i++) {
    document.getElementById(`fairShare${i + 1}`).innerText = "-";
  }
  document.getElementById("output").innerText = "";
}
