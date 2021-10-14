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
  cell0.innerHTML = table.tBodies[0].rows.length - 1;
  cell1.innerHTML = `<input type="number" id="population${
    table.rows.length - 2
  }" name="population" placeholder="Enter"/>`;
  cell2.innerHTML = `<p id="quota${table.rows.length - 2}">-</p>`;
  cell3.innerHTML = `<p id="initialFairShare${table.rows.length - 2}">-</p>`;
  cell4.innerHTML = `<p id="finalFairShare${table.rows.length - 2}">-</p>`;
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

// Calculates the quotas, initial fair shares, final fair shares, and divisor for Hamilton's method.
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
      initialQuotas = [];
      for (var i = 0; i < table.rows.length - 2; i++) {
        initialQuotas[i] =
          Math.round((populations[i] / initialDivisor) * 10000) / 10000;
      }

      // Calculate the initial fair shares.
      initialFairShares = [];
      for (var i = 0; i < table.rows.length - 2; i++) {
        initialFairShares[i] = Math.floor(initialQuotas[i]);
      }

      var finalQuotas = [];
      var decimalList = [];
      var modifiedDivisor = totalPopulations / seats;

      // Initialize the final quotas and decimal list.
      for (var i = 0; i < table.rows.length - 2; i++) {
        finalQuotas[i] =
          Math.round((populations[i] / modifiedDivisor) * 10000) / 10000;
        var decimalPart = (finalQuotas[i] + "").split(".")[1];
        var decimalConversion = "." + decimalPart;
        decimalList[i] = parseFloat(decimalConversion);
      }

      var finalFairShares = [];

      // Initialize the final fair shares.
      for (var i = 0; i < table.rows.length - 2; i++) {
        finalFairShares[i] = Math.floor(initialQuotas[i]);
      }

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
        var highestDecimal = Math.max.apply(Math, decimalList);
        var index = decimalList.indexOf(highestDecimal);
        finalFairShares[index] += 1;
        decimalList[index] = 0;
        timeKeeper += 1;
      }

      if (timeKeeper == 5000) {
        alert("Incalculable numbers. Try different numbers.");
      } else {
        for (var i = 0; i < table.rows.length - 2; i++) {
          document.getElementById(`quota${i + 1}`).innerText = finalQuotas[i];
          document.getElementById(`initialFairShare${i + 1}`).innerText =
            initialFairShares[i];
          document.getElementById(`finalFairShare${i + 1}`).innerText =
            finalFairShares[i];
        }
        document.getElementById("output").innerText = `Divisor is ${
          Math.round(initialDivisor * 10000) / 10000
        }`;
      }
    }
  }
}

function clearData() {
  for (var i = 0; i < table.rows.length - 2; i++) {
    document.getElementById(`quota${i + 1}`).innerText = "-";
    document.getElementById(`initialFairShare${i + 1}`).innerText = "-";
    document.getElementById(`finalFairShare${i + 1}`).innerText = "-";
  }
  document.getElementById("output").innerText = "";
}
