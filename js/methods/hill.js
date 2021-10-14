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
  var cell6 = row.insertCell(6);
  var cell7 = row.insertCell(7);
  cell0.innerHTML = table.tBodies[0].rows.length - 1;
  cell1.innerHTML = `<input type="number" id="population${
    table.rows.length - 2
  }" name="population" placeholder="Enter"/>`;
  cell2.innerHTML = `<p id="initialQuota${table.rows.length - 2}">-</p>`;
  cell3.innerHTML = `<p id="finalQuota${table.rows.length - 2}">-</p>`;
  cell4.innerHTML = `<p id="initialGeometricMean${
    table.rows.length - 2
  }">-</p>`;
  cell5.innerHTML = `<p id="finalGeometricMean${table.rows.length - 2}">-</p>`;
  cell6.innerHTML = `<p id="initialFairShare${table.rows.length - 2}">-</p>`;
  cell7.innerHTML = `<p id="finalFairShare${table.rows.length - 2}">-</p>`;
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

// Calculates the quotas, initial fair shares, final fair shares, and divisors for Huntington Hill's method.
function calculate() {
  // Get the number of seats to apportion.
  seats = document.getElementById("seats").value;
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
      // Total amount of populations.
      var totalPopulations = populations.reduce(function (a, b) {
        return parseFloat(a) + parseFloat(b);
      }, 0);

      // Calculate the initial divisor.
      var initialDivisor = totalPopulations / seats;

      // Calculate the initial quotas.
      var initialQuotas = [];
      for (var i = 0; i < table.rows.length - 2; i++) {
        initialQuotas[i] =
          Math.round((populations[i] / initialDivisor) * 10000) / 10000;
      }

      // Calculate the initial fair shares.
      var initialFairShares = [];
      var initialGeometricMeans = [];
      var finalGeometricMeans = [];
      for (var i = 0; i < table.rows.length - 2; i++) {
        var geoMean =
          Math.round(
            Math.sqrt(
              Math.floor(initialQuotas[i] * (Math.floor(initialQuotas[i]) + 1))
            ) * 10000
          ) / 10000;
        initialGeometricMeans[i] = geoMean;
        finalGeometricMeans[i] = geoMean;
        if (geoMean < initialQuotas[i]) {
          initialFairShares[i] = Math.ceil(initialQuotas[i]);
        } else if (geoMean > initialQuotas[i]) {
          initialFairShares[i] = Math.floor(initialQuotas[i]);
        } else {
          initialFairShares[i] = 0;
        }
      }

      var finalQuotas = [];
      var modifiedDivisor = totalPopulations / seats;

      // Initialize the final quotas.
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
          var geoMean =
            Math.round(
              Math.sqrt(
                Math.floor(finalQuotas[i]) * (Math.floor(finalQuotas[i]) + 1)
              ) * 10000
            ) / 10000;
          finalGeometricMeans[i] = geoMean;
          if (geoMean < finalQuotas[i]) {
            finalFairShares[i] = Math.ceil(finalQuotas[i]);
          } else if (geoMean > finalQuotas[i]) {
            finalFairShares[i] = Math.floor(finalQuotas[i]);
          }
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
            var geoMean =
              Math.round(
                Math.sqrt(
                  Math.floor(finalQuotas[i]) * (Math.floor(finalQuotas[i]) + 1)
                ) * 10000
              ) / 10000;
            finalGeometricMeans[i] = geoMean;
            if (geoMean < finalQuotas[i]) {
              finalFairShares[i] = Math.ceil(finalQuotas[i]);
            } else if (geoMean > finalQuotas[i]) {
              finalFairShares[i] = Math.floor(finalQuotas[i]);
            }
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
          document.getElementById(`finalQuota${i + 1}`).innerText =
            finalQuotas[i];
          document.getElementById(`initialGeometricMean${i + 1}`).innerText =
            initialGeometricMeans[i];
          document.getElementById(`finalGeometricMean${i + 1}`).innerText =
            finalGeometricMeans[i];
          document.getElementById(`initialFairShare${i + 1}`).innerText =
            initialFairShares[i];
          document.getElementById(`finalFairShare${i + 1}`).innerText =
            finalFairShares[i];
        }
        document.getElementById("output").innerText = `Divisor is ${
          Math.round(initialDivisor * 10000) / 10000
        }\nModified divisor is ${Math.round(modifiedDivisor * 10000) / 10000}`;
      }
    }
  }
}

function clearData() {
  for (var i = 0; i < table.rows.length - 2; i++) {
    document.getElementById(`initialQuota${i + 1}`).innerText = "-";
    document.getElementById(`finalQuota${i + 1}`).innerText = "-";
    document.getElementById(`initialGeometricMean${i + 1}`).innerText = "-";
    document.getElementById(`finalGeometricMean${i + 1}`).innerText = "-";
    document.getElementById(`initialFairShare${i + 1}`).innerText = "-";
    document.getElementById(`finalFairShare${i + 1}`).innerText = "-";
  }
  document.getElementById("output").innerText = "";
}
