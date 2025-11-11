
// -------------Navbar Functionality------------//

  window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ===============Navbar Functionality===========




// ------------- Sidebar Functionality --------- //

const menuToggleBtn = document.querySelector("#bar-icon"); // Hamburger button
const sidebarCloseBtn = document.querySelector(".sidebar-close-btn");
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".sidebar-overlay");

// Open Sidebar
menuToggleBtn.addEventListener("click", () => {
  sidebar.classList.add("sidebar--open");
  overlay.classList.add("sidebar-overlay--visible");
});

// Close Sidebar (via X button)
sidebarCloseBtn.addEventListener("click", closeSidebar);

// Close Sidebar (via clicking overlay)
overlay.addEventListener("click", closeSidebar);

// Function to close sidebar
function closeSidebar() {
  sidebar.classList.remove("sidebar--open");
  overlay.classList.remove("sidebar-overlay--visible");
}

// Automatically close sidebar if screen > 1200px
window.addEventListener("resize", () => {
  if (window.innerWidth > 1200) {
    closeSidebar();
  }
});

// ------------- End of Sidebar Functionality --------- //

// ------------Slider Functionality----------//

const slider = document.querySelector(".slider");
let slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");

let index = 1; // Start from the first actual slide (after clone)
let isDragging = false;
let startPos = 0;
let currentTranslate = 0;
let prevTranslate = 0;
let animationID = 0;
let autoSlideInterval;

// ✅ Clone first and last slides for seamless loop
const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);

firstClone.id = "first-clone";
lastClone.id = "last-clone";

slider.appendChild(firstClone);
slider.prepend(lastClone);

slides = document.querySelectorAll(".slide");

// Set initial position
slider.style.transform = `translateX(-${index * 100}%)`;

// ✅ Show a specific slide
function showSlide(i, instant = false) {
  if (!instant) slider.style.transition = "transform 0.5s ease-in-out";
  else slider.style.transition = "none";

  currentTranslate = -i * slider.clientWidth;
  prevTranslate = currentTranslate;
  slider.style.transform = `translateX(${currentTranslate}px)`;

  // Update dots (ignore clones)
  dots.forEach((dot, d) =>
    dot.classList.toggle("active", d === (i - 1 + dots.length) % dots.length)
  );
}

// ✅ Auto slide
function startAutoSlide() {
  stopAutoSlide(); // Prevent multiple intervals
  autoSlideInterval = setInterval(() => {
    index++;
    showSlide(index);
  }, 4000);
}

// ✅ Stop auto slide
function stopAutoSlide() {
  clearInterval(autoSlideInterval);
}

// ✅ Handle seamless looping
slider.addEventListener("transitionend", () => {
  if (slides[index].id === "first-clone") {
    slider.style.transition = "none";
    index = 1;
    slider.style.transform = `translateX(-${index * 100}%)`;
  } else if (slides[index].id === "last-clone") {
    slider.style.transition = "none";
    index = slides.length - 2;
    slider.style.transform = `translateX(-${index * 100}%)`;
  }
});

// ✅ Drag functionality
slider.addEventListener("mousedown", dragStart);
slider.addEventListener("touchstart", dragStart);
slider.addEventListener("mousemove", dragMove);
slider.addEventListener("touchmove", dragMove);
slider.addEventListener("mouseup", dragEnd);
slider.addEventListener("mouseleave", dragEnd);
slider.addEventListener("touchend", dragEnd);

function dragStart(e) {
  isDragging = true;
  startPos = getPositionX(e);
  stopAutoSlide();
  slider.style.cursor = "grabbing";
  slider.style.transition = "none";
  animationID = requestAnimationFrame(animation);
}

function dragMove(e) {
  if (!isDragging) return;
  const currentPosition = getPositionX(e);
  currentTranslate = prevTranslate + currentPosition - startPos;
}

function dragEnd() {
  cancelAnimationFrame(animationID);
  if (!isDragging) return;
  isDragging = false;
  slider.style.cursor = "grab";

  const movedBy = currentTranslate - prevTranslate;

  if (movedBy < -100) index++;
  if (movedBy > 100) index--;

  showSlide(index);

  // Restart auto-slide after 2s
  setTimeout(startAutoSlide, 2000);
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

function animation() {
  slider.style.transform = `translateX(${currentTranslate}px)`;
  if (isDragging) requestAnimationFrame(animation);
}

// ✅ Dots click
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    index = i + 1; // offset for clone
    showSlide(index);
    stopAutoSlide();
    setTimeout(startAutoSlide, 2000);
  });
});

// ✅ Handle tab visibility (prevents blank divs on return)
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoSlide();
  } else {
    showSlide(index, true);
    startAutoSlide();
  }
});

// ✅ Initialize
showSlide(index, true);
startAutoSlide();

// ===============Slider Functionality Ended=========//

// ------------------------Gallery--------------//

document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(".gallery-buttons button");
  const images = document.querySelectorAll(".gallery-grid img");

  // Filter images
  const filterGallery = (category) => {
    images.forEach((img) => {
      if (category === "all" || img.dataset.category === category) {
        img.classList.remove("hidden");
      } else {
        img.classList.add("hidden");
      }
    });
  };

  // Handle active button
  const setActiveButton = (activeButton) => {
    buttons.forEach((btn) => btn.classList.remove("button-all"));
    activeButton.classList.add("button-all");
  };

  // Button click event
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.textContent.toLowerCase();
      setActiveButton(button);
      filterGallery(category);
    });
  });

  // Show all on page load
  filterGallery("all");
});

// =====================Gallery Section Ended=================//

// ------------------How It Works Slider Functionality-------------//

 (function(){
  const leftBtn = document.querySelectorAll(".button_sliders_controll")[0];
  const rightBtn = document.querySelectorAll(".button_sliders_controll")[1];

  const imgContainer = document.querySelector(".img_slider_parent");
  const textContainer = document.querySelector(".text_slider_parent");

  const imgRoll = imgContainer.querySelector(".slider_img_roll");
  const textRoll = textContainer.querySelector(".slider_img_roll");

  const origCount = imgRoll.children.length;
  let index = 1;
  let isAnimating = false;
  let autoplayInterval = null;
  let autoplayRestartTimer = null;

  // clone first and last slides for seamless looping
  const cloneFirst = (roll) => roll.appendChild(roll.children[0].cloneNode(true));
  const cloneLast = (roll) => roll.insertBefore(roll.children[roll.children.length - 1].cloneNode(true), roll.firstChild);
  cloneFirst(imgRoll); cloneLast(imgRoll);
  cloneFirst(textRoll); cloneLast(textRoll);

  // --- sizing ---
  function setWidths() {
    const slideW = imgContainer.clientWidth;
    const imgSlides = Array.from(imgRoll.children);
    const txtSlides = Array.from(textRoll.children);
    imgSlides.forEach(s => s.style.width = slideW + "px");
    txtSlides.forEach(s => s.style.width = slideW + "px");
    imgRoll.style.width = imgSlides.length * slideW + "px";
    textRoll.style.width = txtSlides.length * slideW + "px";
    disableTransition();
    setTransform(index);
    requestAnimationFrame(() => requestAnimationFrame(enableTransition));
  }

  function enableTransition(){
    imgRoll.style.transition = "transform 0.6s ease";
    textRoll.style.transition = "transform 0.6s ease";
  }
  function disableTransition(){
    imgRoll.style.transition = "none";
    textRoll.style.transition = "none";
  }
  function setTransform(i){
    const slideW = imgContainer.clientWidth;
    const x = -i * slideW;
    imgRoll.style.transform = `translateX(${x}px)`;
    textRoll.style.transform = `translateX(${x}px)`;
  }

  setWidths();

  // --- movement control ---
  function goTo(newIndex){
    if(isAnimating) return; // prevent overlapping moves
    isAnimating = true;
    index = newIndex;
    enableTransition();
    setTransform(index);
  }

  function handleTransitionEnd(){
    const slideW = imgContainer.clientWidth;
    if(index === origCount + 1){
      disableTransition();
      index = 1;
      setTransform(index);
    } else if(index === 0){
      disableTransition();
      index = origCount;
      setTransform(index);
    }
    // small delay before allowing next animation
    setTimeout(() => isAnimating = false, 20);
  }

  imgRoll.addEventListener("transitionend", handleTransitionEnd);
  textRoll.addEventListener("transitionend", handleTransitionEnd);

  // --- autoplay ---
  function startAutoplay(){
    stopAutoplay();
    autoplayInterval = setInterval(() => {
      if(!isAnimating) goTo(index + 1);
    }, 3000);
  }
  function stopAutoplay(){
    if(autoplayInterval) clearInterval(autoplayInterval);
    autoplayInterval = null;
  }
  function pauseAutoplayAndRestart(){
    stopAutoplay();
    if(autoplayRestartTimer) clearTimeout(autoplayRestartTimer);
    autoplayRestartTimer = setTimeout(startAutoplay, 3000);
  }

  startAutoplay();

  // --- controls ---
  rightBtn.addEventListener("click", () => {
    pauseAutoplayAndRestart();
    if(!isAnimating) goTo(index + 1);
  });
  leftBtn.addEventListener("click", () => {
    pauseAutoplayAndRestart();
    if(!isAnimating) goTo(index - 1);
  });

  // --- resize safety ---
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(setWidths, 100);
  });

  window.addEventListener("load", () => setTimeout(setWidths, 30));
})();

// ===============How It Works Slider Functionality Ended===============//

// -------------------Happy Customer Slider----------//

var swiper = new Swiper(".mySwiper", {
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
});

// =================Happy Customer Slider Ended===========//