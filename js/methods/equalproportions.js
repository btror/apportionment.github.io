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
}

// Removes the last row from the table.
function removeRow() {
  if (table.rows.length > 3) {
    table.deleteRow(table.rows.length - 1);
  }
}

// Clears all rows from the table.
function resetTable() {
  for (var i = table.rows.length - 1; i > 2; i--) {
    table.deleteRow(i);
  }
}

// Calculates the quotas, initial fair shares, final fair shares, and divisors for Equal Proportions method.
function calculate() {
  // Get the number of seats to apportion.
  var seats = document.getElementById("seats").value;

  // Get the populations from the table.
  var populations = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    populations[i] = document.getElementById(`population${i + 1}`).value;
  }

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
    document.getElementById(`fairShare${i + 1}`).innerText =
      fairShares[i];
  }
}
