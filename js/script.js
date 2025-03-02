function toggleVideo() {
  const trailer = document.querySelector(".trailer");
  const video = document.querySelector("video");
  video.pause();
  toggle.classList.toggle("active");
}

function changeBg(bg, title) {
  const banner = document.querySelector(".banner");
  if (!banner) {
    console.error("Banner element not found!");
    return;
  }

  const imagePath = `./images/movies/${bg}`;
  console.log(`Loading image: ${imagePath}`);

  // Set the background image
  banner.style.background = `url('${imagePath}') no-repeat`;
  banner.style.backgroundSize = "cover";
  banner.style.backgroundPosition = "center";

  // Log success or failure
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
    }
  });
}
