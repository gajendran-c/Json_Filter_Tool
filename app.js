const fileInput = document.getElementById("fileInput");
const jsonDisplay = document.getElementById("jsonDisplay");
const filterContainer = document.getElementById("filterContainer");
const addFilterButton = document.getElementById("addFilterButton");
const applyFiltersButton = document.getElementById("applyFiltersButton");
const exportButton = document.getElementById("exportButton");

let jsonData = [];

// Load JSON from a file
fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        jsonData = JSON.parse(e.target.result);
        jsonDisplay.value = JSON.stringify(jsonData, null, 2);
        populateFilterOptions();
      } catch (err) {
        alert("Invalid JSON file");
      }
    };
    reader.readAsText(file);
  }
});

// Populate filter options
function populateFilterOptions() {
  filterContainer.innerHTML = ""; // Clear existing filters
  addFilterRow(); // Add an initial filter row
}

// Add a new filter row
function addFilterRow() {
  if (!jsonData.length) {
    alert("Please upload a JSON file first.");
    return;
  }

  const keys = Object.keys(jsonData[0]);
  const filterRow = document.createElement("div");
  filterRow.className = "filterRow";

  filterRow.innerHTML = `
    <select class="filterKey">
      <option value="">Select a key</option>
      ${keys.map((key) => `<option value="${key}">${key}</option>`).join("")}
    </select>
    <input type="text" class="filterValue" placeholder="Enter value">
    <button class="removeFilterButton">Remove</button>
  `;

  filterContainer.appendChild(filterRow);

  // Add remove functionality
  filterRow
    .querySelector(".removeFilterButton")
    .addEventListener("click", () => {
      filterRow.remove();
    });
}

// Add new filter rows dynamically
addFilterButton.addEventListener("click", () => {
  addFilterRow();
});

// Apply filters to JSON data
applyFiltersButton.addEventListener("click", () => {
  const filterRows = document.querySelectorAll(".filterRow");
  const filters = Array.from(filterRows).map((row) => {
    const key = row.querySelector(".filterKey").value;
    const value = row.querySelector(".filterValue").value;
    return { key, value };
  });

  const filteredData = jsonData.filter((item) =>
    filters.every((filter) => {
      if (!filter.key || filter.value === "") return true; // Skip empty filters
      return String(item[filter.key]) === filter.value;
    })
  );

  jsonDisplay.value = JSON.stringify(filteredData, null, 2);
});

// Export JSON data
exportButton.addEventListener("click", () => {
  const jsonBlob = new Blob([jsonDisplay.value], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(jsonBlob);
  link.download = "filtered.json";
  link.click();
});
