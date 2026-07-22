// ============================================
// COUNTDOWN JAVASCRIPT - WinterFest Togo
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
});

// ============================================
// COUNTDOWN TIMER
// ============================================
function initCountdown() {
    // WinterFest 2026: 20-22 August 2026
    const eventDate = new Date('August 20, 2026 18:00:00').getTime();

    const countdownElements = {
        days: document.querySelector('.countdown-days .countdown-number'),
        hours: document.querySelector('.countdown-hours .countdown-number'),
        minutes: document.querySelector('.countdown-minutes .countdown-number'),
        seconds: document.querySelector('.countdown-seconds .countdown-number')
    };

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = eventDate - now;

        if (distance < 0) {
            // Event has passed
            if (countdownElements.days) countdownElements.days.textContent = '0';
            if (countdownElements.hours) countdownElements.hours.textContent = '0';
            if (countdownElements.minutes) countdownElements.minutes.textContent = '0';
            if (countdownElements.seconds) countdownElements.seconds.textContent = '0';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownElements.days) countdownElements.days.textContent = days;
        if (countdownElements.hours) countdownElements.hours.textContent = hours;
        if (countdownElements.minutes) countdownElements.minutes.textContent = minutes;
        if (countdownElements.seconds) countdownElements.seconds.textContent = seconds;
    }

    // Update immediately
    updateCountdown();

    // Update every second
    setInterval(updateCountdown, 1000);
}
