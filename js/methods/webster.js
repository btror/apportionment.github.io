// The table.
var table = document.getElementById("tab_logic");

// Adds a new row to the table.
function addRow() {
  var row = table.insertRow(table.rows.length);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  var cell5 = row.insertCell(5);
  cell0.innerHTML = table.tBodies[0].rows.length - 1;
  cell1.innerHTML = `<input type="number" id="population${
    table.rows.length - 2
  }" name="population" placeholder="Enter"/>`;
  cell2.innerHTML = `<p id="initialQuota${table.rows.length - 2}">-</p>`;
  cell3.innerHTML = `<p id="finalQuota${table.rows.length - 2}">-</p>`;
  cell4.innerHTML = `<p id="initialFairShare${table.rows.length - 2}">-</p>`;
  cell5.innerHTML = `<p id="finalFairShare${table.rows.length - 2}">-</p>`;
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

// Calculates the quotas, initial fair shares, final fair shares, and divisors for Webster's method.
function calculate() {
  // Get the number of seats to apportion.
  seats = document.getElementById("seats").value;

  // Get the populations from the table.
  var populations = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    populations[i] = document.getElementById(`population${i + 1}`).value;
  }

  // Total amount of populations.
  var totalPopulations = populations.reduce(function (a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0);

  // Calculate the initial divisor.
  var initialDivisor = totalPopulations / seats;

  // Calculate the initial quotas.
  initialQuotas = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    initialQuotas[i] =
      Math.round((populations[i] / initialDivisor) * 10000) / 10000;
  }

  // Calculate the initial fair shares.
  initialFairShares = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    initialFairShares[i] = Math.round(initialQuotas[i]);
  }

  var finalQuotas = [];
  var modifiedDivisor = totalPopulations / seats;

  // Initialize the final quotas and decimal list.
  for (var i = 0; i < table.rows.length - 2; i++) {
    finalQuotas[i] =
      Math.round((populations[i] / modifiedDivisor) * 10000) / 10000;
  }

  var finalFairShares = [];

  // Initialize the final fair shares.
  for (var i = 0; i < table.rows.length - 2; i++) {
    finalFairShares[i] = Math.round(initialQuotas[i]);
  }

  // Calculate an estimator.
  var estimator =
    populations.reduce(function (a, b) {
      return parseFloat(a) + parseFloat(b);
    }, 0) / seats;

  // Calculate the actual final fair shares.
  var timeKeeper = 0;
  while (
    finalFairShares.reduce(function (a, b) {
      return parseFloat(a) + parseFloat(b);
    }, 0) != seats
  ) {
    if (timeKeeper == 5000) {
      break;
    }
    for (var i = 0; i < table.rows.length - 2; i++) {
      finalFairShares[i] = Math.round(finalQuotas[i]);
    }

    if (
      finalFairShares.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0) != seats
    ) {
      if (
        finalFairShares.reduce(function (a, b) {
          return parseFloat(a) + parseFloat(b);
        }, 0) > seats
      ) {
        modifiedDivisor += estimator;
      } else {
        modifiedDivisor -= estimator;
      }
      estimator = estimator / 2;

      if (modifiedDivisor == 0) {
        modifiedDivisor = 1;
      }

      for (var i = 0; i < table.rows.length - 2; i++) {
        finalQuotas[i] =
          Math.round((populations[i] / modifiedDivisor) * 10000) / 10000;
      }

      for (var i = 0; i < table.rows.length - 2; i++) {
        finalFairShares[i] = Math.round(finalQuotas[i]);
      }
    }
    timeKeeper += 1;
  }

  if (timeKeeper == 5000) {
    alert("Incalculable numbers. Try different numbers.");
  } else {
    for (var i = 0; i < table.rows.length - 2; i++) {
      document.getElementById(`initialQuota${i + 1}`).innerText =
        initialQuotas[i];
      document.getElementById(`finalQuota${i + 1}`).innerText = finalQuotas[i];
      document.getElementById(`initialFairShare${i + 1}`).innerText =
        initialFairShares[i];
      document.getElementById(`finalFairShare${i + 1}`).innerText =
        finalFairShares[i];
    }
  }
}
