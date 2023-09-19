const endpointUrl =
  "https://ligabemowskafunctionsapp.azurewebsites.net/api/GetAllPlayers?";

var tableContent;
var tableButtons;

const createRow = (obj) => {
  const row = document.createElement("tr");
  const objKeys = Object.keys(obj);
  objKeys.map((key) => {
    const cell = document.createElement("td");
    cell.setAttribute("data-attr", key);
    cell.innerHTML = obj[key];
    row.appendChild(cell);
  });
  return row;
};

const getTableContent = (data) => {
  data.map((obj) => {
    const row = createRow(obj);
    tableContent.appendChild(row);
  });
};

const sortData = (data, param, direction = "asc") => {
  tableContent.innerHTML = "";
  const sortedData =
    direction == "asc"
      ? [...data].sort(function (a, b) {
          if (a[param] < b[param]) {
            return -1;
          }
          if (a[param] > b[param]) {
            return 1;
          }
          return 0;
        })
      : [...data].sort(function (a, b) {
          if (b[param] < a[param]) {
            return -1;
          }
          if (b[param] > a[param]) {
            return 1;
          }
          return 0;
        });

  getTableContent(sortedData);
};

const resetButtons = (event) => {
  [...tableButtons].map((button) => {
    if (button !== event.target) {
      button.removeAttribute("data-dir");
    }
  });
};

window.addEventListener("load", () => {
  tableContent = document.getElementById("table-content");
  tableButtons = document.querySelectorAll("th button");

  fetch(endpointUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      getTableContent(data);

      [...tableButtons].map((button) => {
        button.addEventListener("click", (e) => {
          resetButtons(e);
          if (e.target.getAttribute("data-dir") == "desc") {
            sortData(data, e.target.id, "desc");
            e.target.setAttribute("data-dir", "asc");
          } else {
            sortData(data, e.target.id, "asc");
            e.target.setAttribute("data-dir", "desc");
          }
        });
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});
