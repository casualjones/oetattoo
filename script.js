// Dynamic effects
document.addEventListener('DOMContentLoaded', function() {
    // Add some dynamic behavior, e.g., fade in
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.opacity = 0;
        setTimeout(() => {
            hero.style.transition = 'opacity 1s';
            hero.style.opacity = 1;
        }, 100);
    }
});