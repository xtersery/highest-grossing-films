function toggleVideo() {
  const trailer = document.querySelector(".trailer");
  const video = document.querySelector("video");
  video.pause();
  toggle.classList.toggle("active");
}

function fetchAndDisplayMovie(title) {
  fetch(`/get_movie?title=${encodeURIComponent(title)}`)
      .then(response => response.json())
      .then(data => {
          if (data.error) {
              console.error(data.error);
              alert(data.error);
          } else {
              updateMovieDetails(data);
          }
      })
      .catch(error => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
      });
}


function updateMovieDetails(movie) {
  const movieContainer = document.querySelector(".content.active");
  
  if (movieContainer) {
      const movieTitleElement = movieContainer.querySelector(".movie-title");
      if (movieTitleElement) {
          movieTitleElement.alt = movie.title;
      }

      const movieDetailsElement = movieContainer.querySelector("h4");
      if (movieDetailsElement) {
          movieDetailsElement.innerHTML = `
              <span>${movie.year}</span>
              <i>${movie.box_office}</i>
              <span></span>
              <span>${movie.running_time}</span>

              <div class="flex-container">
              <strong>Directed by:</strong> <span>${movie.directors.join(", ")}</span></div>
              <div class="flex-container">
              <strong>Ranking:</strong> <span>${movie.rank}</span></div>
              <div class="flex-container">
              <strong>Countries:</strong> <span>${movie.countries.join(", ")}</span></div>
              </br>
              <div class="flex-container">
              <strong>Production companies: </strong> <span>${movie.production_comp.join(", ")}</span>
              </div>
          `;
      }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const addToListButtons = document.querySelectorAll(".add-to-list");

  addToListButtons.forEach(button => {
      button.addEventListener("click", function (event) {
          event.preventDefault(); 

          const activeContent = document.querySelector(".content.active");

          if (activeContent) {
              const movieTitle = activeContent.dataset.movieTitle;

              addMovieToList(movieTitle);
          } else {
              alert("No active movie found.");
          }
      });
    }
  );
  fetchAndDisplayMovie('Avatar');
});


function addMovieToList(movieTitle) {
  fetch("/add_movie", {
      method: "POST",
      headers: {
          "Content-Type": "application/json",
      },
      body: JSON.stringify({ movie_title: movieTitle }),
  })
      .then(response => response.json())
      .then(data => {
          if (data.message) {
              alert(data.message);
          } else if (data.error) {
              alert(data.error);
          }
      })
      .catch(error => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
      });
}

function changeBg(bg, title) {
  const banner = document.querySelector(".banner");
  if (!banner) {
    console.error("Banner element not found!");
    return;
  }
  const imagePath = `${imageBasePath}${bg}`;
  console.log(`Loading image: ${imagePath}`);

  banner.style.background = `url('${imagePath}') no-repeat`;
  banner.style.backgroundSize = "cover";
  banner.style.backgroundPosition = "center";

  const img = new Image();
  img.src = imagePath;
  img.onload = () => {
    console.log("Image loaded successfully!");
  };
  img.onerror = () => {
    console.error("Failed to load image!");
  };

  const contents = document.querySelectorAll(".content")
  contents.forEach((content) => {
    content.classList.remove("active");
    if (content.classList.contains(title)) {
      content.classList.add("active");
      const movieTitle = content.getAttribute('data-movie-title');
      fetchAndDisplayMovie(movieTitle);
    }
  });
}

const searchWrapper = document.querySelector(".search");
const inputBox = searchWrapper.querySelector("input");
const suggBox = searchWrapper.querySelector(".autocom-box");

inputBox.onkeyup = (e) => {
  let userData = e.target.value;
  let emptyArray = [];
  if (userData) {
    emptyArray = suggestions.filter((data) => {
      return data.toLocaleLowerCase().startsWith(userData.toLocaleLowerCase());
    });
    emptyArray = emptyArray.map((data) => {
      return data = '<li>' + data + '</li>';
    });
    console.log(emptyArray);
    searchWrapper.classList.add('active');
    showSuggestions(emptyArray);
    let allList = suggBox.querySelectorAll("li");
    for (let i = 0; i < allList.length; i++) {
      allList[i].addEventListener("click", function () {
        select(this);
      });
    }
  } else {
    searchWrapper.classList.remove('active');
  }
}

function select(elem) {
  let selectUserData = elem.textContent;
  inputBox.value = selectUserData;
  searchWrapper.classList.remove('active');

  if (mapping[selectUserData]) {
    mapping[selectUserData]();
  } else {
    console.log("No function found for:", selectUserData);
  }

}

function showSuggestions(list) {
  let listData;
  if (!list.length) {
    userValue = inputBox.value;
    listData = '<li>' + userValue + '</li>';
  } else {
    listData = list.join('');
  }
  suggBox.innerHTML = listData;
}

const clickableElements = document.querySelectorAll(".clickable-element");

clickableElements.forEach((element) => {
  element.addEventListener("click", (event) => {
    if (element.classList.contains("unavailable")) {
      event.preventDefault(); 
      event.stopPropagation(); 
      alert("This feature is unavailable.");
    }
  });
});