// Mobile Menu Toggle
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

mobileBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Catalogue Slider
const catalogueSlider = document.getElementById('catalogue-slider');

let isCatalogueDragging = false;
let catalogueStartX;
let catalogueScrollLeft;

function startCatalogueDrag(e) {
    isCatalogueDragging = true;
    catalogueSlider.classList.add('active');
    catalogueStartX = (e.pageX || e.touches[0].pageX) - catalogueSlider.offsetLeft;
    catalogueScrollLeft = catalogueSlider.scrollLeft;
}

function endCatalogueDrag() {
    isCatalogueDragging = false;
    catalogueSlider.classList.remove('active');
}

function moveCatalogueDrag(e) {
    if (!isCatalogueDragging) return;
    e.preventDefault();
    const x = (e.pageX || e.touches[0].pageX) - catalogueSlider.offsetLeft;
    const walk = (x - catalogueStartX) * 2;
    catalogueSlider.scrollLeft = catalogueScrollLeft - walk;
}

catalogueSlider.addEventListener('mousedown', startCatalogueDrag);
catalogueSlider.addEventListener('mouseleave', endCatalogueDrag);
catalogueSlider.addEventListener('mouseup', endCatalogueDrag);
catalogueSlider.addEventListener('mousemove', moveCatalogueDrag);

catalogueSlider.addEventListener('touchstart', startCatalogueDrag, { passive: false });
catalogueSlider.addEventListener('touchend', endCatalogueDrag);
catalogueSlider.addEventListener('touchmove', moveCatalogueDrag, { passive: false });

function scrollCatalogue(direction) {
    const scrollAmount = 320;
    if (direction === 'left') {
        catalogueSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
        catalogueSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
}

// ────────────────────────────────────────────────
// Lightbox / Gallery
// ────────────────────────────────────────────────

const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const dotsContainer = document.getElementById('dots-container');
const closeBtn = document.getElementById('close-lightbox');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const imageContainer = document.getElementById('image-container');

let currentImages = [];
let currentIndex = 0;
let touchStartX = 0;
let touchEndX = 0;
let isLightboxDragging = false;
let lightboxStartX = 0;

function debounce(fn, delay = 140) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}

const debouncedPrev = debounce(() => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateImageAndDots();
}, 140);

const debouncedNext = debounce(() => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateImageAndDots();
}, 140);

function preloadAdjacent() {
    if (currentIndex > 0) new Image().src = currentImages[currentIndex - 1];
    if (currentIndex < currentImages.length - 1) new Image().src = currentImages[currentIndex + 1];
}

function updateImageAndDots() {
    lightboxImg.src = currentImages[currentIndex];
    preloadAdjacent();

    dotsContainer.innerHTML = '';
    currentImages.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = `w-3 h-3 rounded-full transition-all duration-300 ${
            i === currentIndex ? 'bg-blue-500 scale-125' : 'bg-white/50 hover:bg-white/80'
        }`;
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateImageAndDots();
        });
        dotsContainer.appendChild(dot);
    });
}

document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
        currentImages = JSON.parse(card.dataset.images || '[]');
        if (currentImages.length === 0) return;
        currentIndex = 0;
        updateImageAndDots();
        lightbox.classList.remove('hidden');
        setTimeout(() => lightbox.classList.remove('opacity-0'), 20);
    });
});

function goToPrev() { debouncedPrev(); }
function goToNext() { debouncedNext(); }

prevBtn.addEventListener('click', goToPrev);
nextBtn.addEventListener('click', goToNext);

// Touch swipe – with passive: false for better iOS control
imageContainer.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: false });

imageContainer.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 60) {
        if (diff > 0) goToNext();
        else goToPrev();
    }
}, { passive: false });

// Mouse drag
imageContainer.addEventListener('mousedown', e => {
    isLightboxDragging = true;
    lightboxStartX = e.clientX;
    imageContainer.style.cursor = 'grabbing';
});

imageContainer.addEventListener('mousemove', e => {
    if (!isLightboxDragging) return;
});

imageContainer.addEventListener('mouseup', e => {
    if (!isLightboxDragging) return;
    isLightboxDragging = false;
    imageContainer.style.cursor = 'grab';
    const diff = lightboxStartX - e.clientX;
    if (Math.abs(diff) > 60) {
        if (diff > 0) goToNext();
        else goToPrev();
    }
});

imageContainer.addEventListener('mouseleave', () => {
    isLightboxDragging = false;
    imageContainer.style.cursor = 'grab';
});

// Close
closeBtn.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
});

function closeLightbox() {
    lightbox.classList.add('opacity-0');
    setTimeout(() => lightbox.classList.add('hidden'), 300);
}

// Keyboard
window.addEventListener('keydown', e => {
    if (lightbox.classList.contains('hidden')) return;
    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrev();
    }
    else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
    }
    else if (e.key === 'Escape') {
        closeLightbox();
    }
}, { passive: false });

// Google Sheet Form
const scriptURL = 'https://script.google.com/macros/s/AKfycbwLLRmiuConet7hmM-ZtNTqQHPUAupWWw5yDhSBROY-Uh3-fVrH7KYCECL_2-_jtaZI/exec';

const form = document.querySelector('#contact-form');
const submitBtn = document.querySelector('#submit-btn');

if (form && submitBtn) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const originalText = submitBtn.innerText;
        submitBtn.innerText = "Sending...";
        submitBtn.disabled = true;

        fetch(scriptURL, { method: 'POST', body: new FormData(form) })
            .then(() => {
                alert("Success! Your message has been sent. We will get back to you soon.");
                form.reset();
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert("Error! Message not sent. Please try again.");
                submitBtn.innerText = originalText;
                submitBtn.disabled = false;
            });
    });
}
