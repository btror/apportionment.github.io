var table = document.getElementById("tab_logic");

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
  cell2.innerHTML = "-";
  cell3.innerHTML = "-";
  cell4.innerHTML = "-";
}

function removeRow() {
  if (table.rows.length > 3) {
    table.deleteRow(table.rows.length - 1);
  }
}

function resetTable() {
  for (var i = table.rows.length - 1; i > 2; i--) {
    table.deleteRow(i);
  }
}

function calculate() {
  seats = document.getElementById("seats").value;

  var populations = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    populations[i] = document.getElementById(`population${i + 1}`).value;
  }

  var states = table.rows.length - 2;
  var totalPopulations = populations.reduce(function (a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0);

  var initialDivisor = totalPopulations / seats;

  initialQuotas = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    initialQuotas[i] = populations[i] / initialDivisor;
  }

  initialFairShares = [];
  for (var i = 0; i < table.rows.length - 2; i++) {
    initialFairShares[i] = Math.floor(initialQuotas[i]);
  }

  var finalQuotas = [];
  var decimalList = [];

  var modifiedDivisor = totalPopulations / seats;

  for (var i = 0; i < table.rows.length - 2; i++) {
    finalQuotas[i] = populations[i] / modifiedDivisor;
    var decimalPart = (populations[i] / modifiedDivisor + "").split(".")[1];
    var decimalConversion = "." + decimalPart;
    decimalList[i] = parseFloat(decimalConversion);
  }

  var finalFairShares = [];

  for (var i = 0; i < table.rows.length - 2; i++) {
    finalFairShares[i] = Math.floor(initialQuotas[i]);
  }

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
    console.log(highestDecimal);
    var index = decimalList.indexOf(highestDecimal);
    finalFairShares[index] += 1;
    decimalList[index] = 0;
    timeKeeper += 1;
  }

  if (timeKeeper == 5000) {
    console.log("incalculable values");
  } else {
    console.log("initial quotas " + initialQuotas);
    console.log("final quotas " + finalQuotas);
    console.log("initial fair shares " + initialFairShares);
    console.log("final fair shares " + finalFairShares);
    console.log("modified divisor " + modifiedDivisor);
  }
}
