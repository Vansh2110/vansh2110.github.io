// Mobile Menu
const btn = document.getElementById('mobile-menu-btn');
const menu = document.getElementById('mobile-menu');
const links = document.querySelectorAll('.mobile-link');
btn.addEventListener('click', () => menu.classList.toggle('hidden'));
links.forEach(link => link.addEventListener('click', () => menu.classList.add('hidden')));

// Slider
const slider = document.getElementById('catalog-slider');
function scrollCatalog(d) {
    slider.scrollBy({ left: d === 'left' ? -320 : 320, behavior: 'smooth' });
}

// Navbar
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-md', 'h-16'); nav.classList.remove('h-20');
    } else {
        nav.classList.remove('shadow-md', 'h-16'); nav.classList.add('h-20');
    }
});

// --- GOOGLE SHEET CONNECTION ---

// PASTE YOUR GOOGLE WEB APP URL HERE
const scriptURL = 'https://script.google.com/macros/s/AKfycbwLLRmiuConet7hmM-ZtNTqQHPUAupWWw5yDhSBROY-Uh3-fVrH7KYCECL_2-_jtaZI/exec';

const form = document.querySelector('#contact-form');
const submitBtn = document.querySelector('#submit-btn');

form.addEventListener('submit', e => {
    e.preventDefault();
    
    // Loading State
    const originalBtnText = submitBtn.innerText;
    submitBtn.innerText = "Sending...";
    submitBtn.disabled = true;

    fetch(scriptURL, { method: 'POST', body: new FormData(form)})
        .then(response => {
            alert("Success! Your message has been sent. We will get back to you soon.");
            form.reset();
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        })
        .catch(error => {
            console.error('Error!', error.message);
            alert("Error! Message not sent.");
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        });
});