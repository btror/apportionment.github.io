var table = document.getElementById("tab_logic");

function addRow() {
  var row = table.insertRow(table.rows.length);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  cell0.innerHTML = table.tBodies[0].rows.length - 1;
  cell1.innerHTML =
    '<input type="number" name="population" placeholder="Enter"/>';
  cell2.innerHTML = "-";
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
  //TODO: implement webster method
}
