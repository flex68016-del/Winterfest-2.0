// ============================================
// CONTACT JAVASCRIPT - WinterFest Togo
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initContactForm();
    initVolunteerForm();
});

// ============================================
// ACCORDION (FAQ)
// ============================================
function initAccordion() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordionItem = header.parentElement;
            const isActive = accordionItem.classList.contains('active');

            // Close all accordion items
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                accordionItem.classList.add('active');
            }
        });
    });
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Create mailto link
            const mailtoLink = `mailto:contact@winterfesttogo.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
                `Nom: ${name}\nEmail: ${email}\nTéléphone: ${phone}\n\nMessage:\n${message}`
            )}`;

            // Open email client
            window.location.href = mailtoLink;

            // Show success message
            showFormMessage(contactForm, 'Votre message a été préparé. Veuillez l\'envoyer via votre client email.', 'success');
        });
    }
}

// ============================================
// VOLUNTEER FORM
// ============================================
function initVolunteerForm() {
    const volunteerForm = document.getElementById('volunteer-form');

    if (volunteerForm) {
        volunteerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Redirect to Google Forms
            const googleFormsUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScN4eUH--0uT6GzMbimxPt9Gm9PizcLvtIEgL1N-44qPZXHxQ/viewform?usp=header';
            
            // Open in new tab
            window.open(googleFormsUrl, '_blank');

            // Show success message
            showFormMessage(volunteerForm, 'Redirection vers le formulaire d\'inscription...', 'success');
        });
    }
}

// ============================================
// FORM MESSAGE UTILITY
// ============================================
function showFormMessage(form, message, type) {
    // Remove existing message
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 8px;
        text-align: center;
        font-weight: 500;
        ${type === 'success' ? 'background: #d4edda; color: #155724;' : 'background: #f8d7da; color: #721c24;'}
    `;

    form.appendChild(messageDiv);

    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// ============================================
// FORM VALIDATION
// ============================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^\+?[\d\s-]{10,}$/;
    return re.test(phone);
}
