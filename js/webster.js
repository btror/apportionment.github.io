function addRow() {
  var table = document.getElementById("tab_logic");
  var row = table.insertRow(table.rows.length);
  var cell0 = row.insertCell(0);
  var cell1 = row.insertCell(1);
  var cell2 = row.insertCell(2);
  var cell3 = row.insertCell(3);
  var cell4 = row.insertCell(4);
  var cell5 = row.insertCell(5);
  cell0.innerHTML = table.tBodies[0].rows.length - 1;
  cell1.innerHTML =
    '<input type="number" name="population" placeholder="Enter"/>';
  cell2.innerHTML = "-";
  cell3.innerHTML = "-";
  cell4.innerHTML = "-";
  cell5.innerHTML = "-";
}

function removeRow() {
  var table = document.getElementById("tab_logic");
  if (table.rows.length > 3) {
    table.deleteRow(table.rows.length - 1);
  }
}
