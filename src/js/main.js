// ============================================================
// MP1 Portfolio - Main JavaScript
// ============================================================

// ---------- Navbar ----------
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("nav-toggle");
const navLinks = document.querySelector(".navbar__links");
const navItems = document.querySelectorAll(".navbar__links a");


// Shrink navbar when the user scrolls
function updateNavbar() {
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", updateNavbar);


// Mobile navigation
navToggle.addEventListener("click", () => {
    navLinks.classList.toggle("open");
});


// Close mobile navigation after selecting a section
navItems.forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
    });
});


// ---------- Position Indicator ----------
const sections = document.querySelectorAll("main section[id]");
const sectionLinks = document.querySelectorAll(".navbar__links a");

function updatePositionIndicator() {
    const scrollPosition = window.scrollY + window.innerHeight * 0.35;

    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;

        if (
            scrollPosition >= sectionTop &&
            scrollPosition < sectionBottom
        ) {
            currentSection = section.id;
        }
    });

    sectionLinks.forEach((link) => {
        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updatePositionIndicator);
window.addEventListener("resize", updatePositionIndicator);


// ---------- Project Carousel ----------
const slides = document.querySelectorAll(".project-slide");
const previousButton = document.getElementById("carousel-prev");
const nextButton = document.getElementById("carousel-next");

let currentSlide = 0;


function showSlide(index) {
    if (index < 0) {
        currentSlide = slides.length - 1;
    } else if (index >= slides.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle(
            "active",
            slideIndex === currentSlide
        );
    });
}


previousButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
});


nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
});


// Allow keyboard navigation for the carousel
document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
        showSlide(currentSlide - 1);
    }

    if (event.key === "ArrowRight") {
        showSlide(currentSlide + 1);
    }
});


// ---------- Modals ----------
const modalButtons = document.querySelectorAll(".modal-button");
const modals = document.querySelectorAll(".modal");
const modalCloseButtons = document.querySelectorAll(".modal__close");


function openModal(modalId) {
    const modal = document.getElementById(modalId);

    if (modal) {
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
    }
}


function closeModal(modal) {
    modal.classList.remove("open");
    document.body.style.overflow = "";
}


// Open modal buttons
modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modalId = button.getAttribute("data-modal");
        openModal(modalId);
    });
});


// Close buttons
modalCloseButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = button.closest(".modal");
        closeModal(modal);
    });
});


// Close modal when clicking outside the modal content
modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal(modal);
        }
    });
});


// Close modal with Escape key
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modals.forEach((modal) => {
            if (modal.classList.contains("open")) {
                closeModal(modal);
            }
        });
    }
});


// ---------- Initial State ----------
updateNavbar();
updatePositionIndicator();
showSlide(0);
