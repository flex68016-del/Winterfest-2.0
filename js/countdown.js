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
        seconds: document.querySelector('.countdown-seconds .countdown-number'),
        daysLabel: document.querySelector('.countdown-days .countdown-label'),
        hoursLabel: document.querySelector('.countdown-hours .countdown-label'),
        minutesLabel: document.querySelector('.countdown-minutes .countdown-label'),
        secondsLabel: document.querySelector('.countdown-seconds .countdown-label')
    };

    function updateLabels() {
        const currentLang = window.i18n ? window.i18n.currentLang : 'fr';
        const translations = window.i18n ? window.i18n.translations[currentLang] : null;
        
        if (translations && translations.home) {
            if (countdownElements.daysLabel && translations.home.countdown_days) {
                countdownElements.daysLabel.textContent = translations.home.countdown_days;
            }
            if (countdownElements.hoursLabel && translations.home.countdown_hours) {
                countdownElements.hoursLabel.textContent = translations.home.countdown_hours;
            }
            if (countdownElements.minutesLabel && translations.home.countdown_minutes) {
                countdownElements.minutesLabel.textContent = translations.home.countdown_minutes;
            }
            if (countdownElements.secondsLabel && translations.home.countdown_seconds) {
                countdownElements.secondsLabel.textContent = translations.home.countdown_seconds;
            }
        }
    }

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

    // Wait for i18n to be ready before updating labels
    function waitForI18n() {
        if (window.i18n && window.i18n.translations) {
            updateLabels();
            window.addEventListener('languageChanged', updateLabels);
        } else {
            setTimeout(waitForI18n, 100);
        }
    }

    // Start the countdown immediately
    updateCountdown();
    setInterval(updateCountdown, 1000);

    // Wait for i18n to be ready for labels
    waitForI18n();
}
