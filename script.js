// Add smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add scroll animation for service cards
const serviceCards = document.querySelectorAll('.service-card');
window.addEventListener('scroll', () => {
    serviceCards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        if (cardTop < window.innerHeight - 100) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
});

// Mobile menu toggle (you'll need to add a hamburger menu button in HTML)
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Add functionality to Read More buttons
document.querySelectorAll('.read-more').forEach(button => {
    button.addEventListener('click', function() {
        // Find the parent service card
        const card = this.closest('.service-card');
        // Find the details section within this card
        const details = card.querySelector('.service-details');
        
        // Toggle the active class on both button and details
        details.classList.toggle('active');
        this.classList.toggle('active');
        
        // Change button text based on state
        if (this.classList.contains('active')) {
            this.textContent = 'Read Less';
        } else {
            this.textContent = 'Read More';
        }
    });
});

// Add functionality to show/hide the back-to-top button
window.addEventListener('scroll', () => {
    const backToTop = document.querySelector('.back-to-top');
    if (window.scrollY > 300) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
});