document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".tm-slider-track");
    const cards = document.querySelectorAll(".tm-card");
    const dots = document.querySelectorAll(".tm-dot");
    const leftArrow = document.querySelector(".tm-arrow-left");
    const rightArrow = document.querySelector(".tm-arrow-right");


    let currentIndex = 0;
    let autoScrollInterval;
    

    // 1. Check screen logic ki kitne cards dikhane hain
    function getVisibleCount() {
        if (window.innerWidth > 992) return 3;
        if (window.innerWidth > 650) return 2;
        return 1;
    }

    // 2. Max index bound fix taake extra drag na ho ya blank space na aaye
    function getMaxIndex() {
        return Math.max(0, cards.length - getVisibleCount());
    }

   function moveSlider() {
    const cardWidth = cards[0].offsetWidth;
    const gap = 30;

    track.style.transition = "transform 0.5s ease";
    track.style.transform =
        `translateX(-${currentIndex * (cardWidth + gap)}px)`;

    if (currentIndex >= originalCards.length) {
        setTimeout(() => {
            track.style.transition = "none";
            currentIndex = 0;
            track.style.transform = "translateX(0)";
        }, 500);
    }
}

        const originalCards = Array.from(cards);

originalCards.forEach(card => {
    const clone = card.cloneNode(true);
    track.appendChild(clone);
});
    // 6. Navigation Control Actions
function nextSlide() {
    currentIndex++;
    moveSlider();
}

   function previousSlide() {
    if (currentIndex <= 0) {
        currentIndex = originalCards.length;
        track.style.transition = "none";

        const cardWidth = cards[0].offsetWidth;
        track.style.transform =
            `translateX(-${currentIndex * (cardWidth + 30)}px)`;

        setTimeout(() => {
            track.style.transition = "transform 0.5s ease";
            currentIndex--;
            moveSlider();
        }, 50);
    } else {
        currentIndex--;
        moveSlider();
    }
}
    // 7. Click bindings directly mapping manual actions
    if (rightArrow) {
        rightArrow.addEventListener("click", function(e) {
            e.preventDefault();
            nextSlide();
            resetAutoScroll();
        });
    }

    if (leftArrow) {
        leftArrow.addEventListener("click", function(e) {
            e.preventDefault();
            previousSlide();
            resetAutoScroll();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener("click", function (e) {
            e.preventDefault();
            const visibleCount = getVisibleCount();
            const centerOffset = Math.floor(visibleCount / 2);
            
            // Map index target seamlessly back tracking view index position 
            let targetIndex = index - centerOffset;
            const maxIndex = getMaxIndex();

            // Safety limit clamp bounds check
            if (targetIndex < 0) targetIndex = 0;
            if (targetIndex > maxIndex) targetIndex = maxIndex;

            currentIndex = targetIndex;
            moveSlider();
            resetAutoScroll();
        });
    });

    // 8. Auto Scroller System (Fixed Interval Stacking Bug)
    function startAutoScroll() {
        autoScrollInterval = setInterval(nextSlide, 5000);
    }

    function resetAutoScroll() {
        clearInterval(autoScrollInterval);
        startAutoScroll(); // Fresh neat cycle recreate
    }

    // 9. Resize recalculations wrapper handler safely
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0; 
            moveSlider();
        }, 100);
    });

    // Initialize execution run
    moveSlider();
    startAutoScroll();
});