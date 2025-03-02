// DOM Elements
const addMovieBtn = document.getElementById("add-movie-btn");
const movieModal = document.getElementById("movie-modal");
const closeModal = document.querySelector(".close");
const movieForm = document.getElementById("movie-form");
const movieTableBody = document.querySelector("#movie-table tbody");

// Open modal when "Add New Movie" button is clicked
addMovieBtn.addEventListener("click", () => {
  movieModal.style.display = "block";
});

// Close modal when close button is clicked
closeModal.addEventListener("click", () => {
  movieModal.style.display = "none";
});

// Close modal when clicking outside the modal
window.addEventListener("click", (event) => {
  if (event.target === movieModal) {
    movieModal.style.display = "none";
  }
});

// Handle form submission
movieForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get form values
  const title = document.getElementById("title").value;
  const rating = document.getElementById("rating").value;

  // Add movie to the table
  addMovieToTable(title, rating);

  // Clear form and close modal
  movieForm.reset();
  movieModal.style.display = "none";
});

// Function to add a movie to the table
function addMovieToTable(title, rating) {
  const newRow = document.createElement("tr");

  const titleCell = document.createElement("td");
  titleCell.textContent = title;

  const ratingCell = document.createElement("td");
  ratingCell.textContent = rating;

  const actionsCell = document.createElement("td");
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    newRow.remove();
  });

  actionsCell.appendChild(deleteBtn);

  newRow.appendChild(titleCell);
  newRow.appendChild(ratingCell);
  newRow.appendChild(actionsCell);

  movieTableBody.appendChild(newRow);
}