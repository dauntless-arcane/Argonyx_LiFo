// Function to toggle the login dropdown
function toggleLoginDropdown() {
  const dropdown = document.getElementById("loginDropdown");
  dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
}

// Close dropdown if clicked outside
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

// Carousel functionality
let currentSlideIndex = 0;
const slidesContainer = document.querySelector('.slides');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');

// Function to update the position of the slides
function updateSlidePosition() {
  const slideWidth = slides[0].offsetWidth; // Get the width of each slide
  slidesContainer.style.transform = `translateX(-${currentSlideIndex * slideWidth}px)`; // Update the carousel position
}

// Event listener for the 'prev' button
prevButton.addEventListener('click', () => {
  // Move to the previous slide and loop if needed
  currentSlideIndex = (currentSlideIndex === 0) ? slides.length - 1 : currentSlideIndex - 1;
  updateSlidePosition();
});

// Event listener for the 'next' button
nextButton.addEventListener('click', () => {
  // Move to the next slide and loop if needed
  currentSlideIndex = (currentSlideIndex === slides.length - 1) ? 0 : currentSlideIndex + 1;
  updateSlidePosition();
});

// Function for automatic sliding
function autoSlide() {
  currentSlideIndex = (currentSlideIndex + 1) % slides.length; // Loop back to the first slide when reaching the last
  updateSlidePosition();
}

// Initialize the slide position on page load
updateSlidePosition();

// Set interval for auto-slide every 3 seconds
setInterval(autoSlide, 3000);
