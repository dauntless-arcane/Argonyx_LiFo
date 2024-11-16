// Function to toggle the login dropdown
function toggleLoginDropdown() {
  const dropdown = document.getElementById("loginDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

document.addEventListener("click", (e) => {
  const loginDropdown = document.getElementById("loginDropdown");
  const isClickInside = e.target.closest(".nav-dropdown");
  
  if (!isClickInside && loginDropdown.style.display === "block") {
    loginDropdown.style.display = "none";
  }
});

// Function to check if an element is in the viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top < window.innerHeight && rect.bottom > 0
  );
}

// Function to trigger animations on scroll
function animateOnScroll() {
  const sections = document.querySelectorAll('.section-content');
  sections.forEach((section) => {
    if (isInViewport(section)) {
      section.classList.add('animate');
    }
  });
}

// Event listeners for scroll and load events
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

let currentSlide = 0;

function moveSlide(direction) {
  const carousel = document.querySelector('.carousel');
  const slides = document.querySelectorAll('.carousel img');
  const totalSlides = slides.length;

  const visibleSlides = 3; // Number of images visible at once
  const maxSlideIndex = Math.ceil(totalSlides / visibleSlides) - 1; // Last group index

  // Update the currentSlide index
  currentSlide += direction;

  // Wrap around to the beginning or end
  if (currentSlide < 0) {
    currentSlide = maxSlideIndex;
  } else if (currentSlide > maxSlideIndex) {
    currentSlide = 0;
  }

  // Calculate the offset for the transform property
  const offset = -currentSlide * 100; // Each group takes up 100% width
  carousel.style.transform = `translateX(${offset}%)`;
}
