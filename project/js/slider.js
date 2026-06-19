/*
    FILE: slider.js
    PURPOSE: Simple testimonial slider and portfolio card hover effects
*/

document.addEventListener('DOMContentLoaded', () => {
    initializeSlider();
    initializeTiltCards();
    initializePortfolioFilter();
});

function initializeSlider() {
    const slides = qsa('.testimonial-slider .slide');
    if (!slides.length) return;

    let activeIndex = 0;
    setInterval(() => {
        slides[activeIndex].classList.remove('active');
        activeIndex = (activeIndex + 1) % slides.length;
        slides[activeIndex].classList.add('active');
    }, 6000);
}

function initializeTiltCards() {
    qsa('.tilt-card').forEach(card => {
        card.addEventListener('mousemove', event => {
            const rect = card.getBoundingClientRect();
            const x = event.clientX - rect.left - rect.width / 2;
            const y = event.clientY - rect.top - rect.height / 2;
            card.style.transform = `perspective(900px) rotateX(${(-y / 18).toFixed(2)}deg) rotateY(${(x / 18).toFixed(2)}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
        });
    });
}

function initializePortfolioFilter() {
    const filters = qsa('.filter-btn');
    const projects = qsa('.portfolio-card');
    if (!filters.length || !projects.length) return;

    filters.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter || 'all';
            filters.forEach(btn => btn.classList.toggle('active', btn === button));
            projects.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });
}
