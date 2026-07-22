// ============================================
// CONTACT JAVASCRIPT - WinterFest Togo
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initAccordion();
    initWeb3Forms();
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
// WEB3FORMS UNIFIED SUBMISSION
// ============================================
function initWeb3Forms() {
    const forms = document.querySelectorAll('form[action="https://api.web3forms.com/submit"]');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Check honeypot
            const honeypot = form.querySelector('input[name="honeypot"]');
            if (honeypot && honeypot.value) {
                return;
            }

            // Clear previous messages
            clearFormMessages(form);

            // Validate form
            const validation = validateForm(form);
            if (!validation.valid) {
                showFormMessage(form, validation.message, 'error');
                return;
            }

            // Show loading state
            const submitBtn = form.querySelector('.form-submit');
            setFormLoading(form, true);

            // Prepare form data
            const formData = new FormData(form);
            
            // Sanitize values
            const sanitizedData = {};
            for (const [key, value] of formData.entries()) {
                if (key !== 'honeypot' && key !== 'access_key' && key !== 'subject' && key !== 'from_name' && key !== 'source') {
                    sanitizedData[key] = sanitizeInput(value);
                }
            }

            // Add sanitized values back to FormData
            const submitFormData = new FormData();
            formData.forEach((value, key) => {
                if (sanitizedData[key] !== undefined) {
                    submitFormData.append(key, sanitizedData[key]);
                } else {
                    submitFormData.append(key, value);
                }
            });

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: submitFormData
                });

                const result = await response.json();

                if (result.success) {
                    // Determine success message based on form source
                    const source = formData.get('source');
                    let successKey = 'js.form.success_contact';
                    if (source === 'Formulaire Bénévole') successKey = 'js.form.success_volunteer';
                    else if (source === 'Formulaire Hébergement') successKey = 'js.form.success_housing';
                    else if (source === 'Formulaire Inscription') successKey = 'js.form.success_registration';

                    const successMsg = window.i18n ? window.i18n.t(successKey) : 'Merci ! Votre formulaire a été envoyé avec succès.';
                    showFormMessage(form, successMsg, 'success');
                    form.reset();
                } else {
                    const errorMsg = window.i18n ? window.i18n.t('js.form.error') : 'Une erreur est survenue. Veuillez réessayer.';
                    showFormMessage(form, errorMsg, 'error');
                }
            } catch (error) {
                const errorMsg = window.i18n ? window.i18n.t('js.form.error') : 'Une erreur est survenue. Veuillez réessayer.';
                showFormMessage(form, errorMsg, 'error');
            } finally {
                setFormLoading(form, false);
            }
        });
    });
}

function validateForm(form) {
    const source = form.querySelector('input[name="source"]')?.value;
    
    // Common validation
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput && emailInput.value.trim()) {
        if (!validateEmail(emailInput.value.trim())) {
            return { valid: false, message: window.i18n ? window.i18n.t('js.form.error_email_invalid') : 'Veuillez entrer une adresse email valide.' };
        }
    }

    const phoneInput = form.querySelector('input[type="tel"]');
    if (phoneInput && phoneInput.value.trim()) {
        if (!validatePhone(phoneInput.value.trim())) {
            return { valid: false, message: window.i18n ? window.i18n.t('js.form.error_phone_invalid') : 'Veuillez entrer un numéro de téléphone valide.' };
        }
    }

    // Checkbox validation for volunteer form
    if (source === 'Formulaire Bénévole') {
        const checkboxes = form.querySelectorAll('input[name="service"]:checked');
        if (checkboxes.length === 0) {
            return { valid: false, message: window.i18n ? window.i18n.t('js.form.error_service_required') : 'Veuillez sélectionner au moins un service.' };
        }
    }

    // GDPR validation for contact form
    if (source === 'Formulaire Contact') {
        const gdpr = form.querySelector('input[name="gdpr"]');
        if (!gdpr || !gdpr.checked) {
            return { valid: false, message: window.i18n ? window.i18n.t('js.form.error_gdpr_required') : 'Vous devez accepter la politique de confidentialité.' };
        }
    }

    // Required fields validation (HTML5 validation handles most, but we double-check)
    const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
    for (const input of requiredInputs) {
        if (!input.value.trim()) {
            return { valid: false, message: window.i18n ? window.i18n.t('js.form.error') : 'Veuillez remplir tous les champs obligatoires.' };
        }
    }

    return { valid: true };
}

function sanitizeInput(value) {
    if (typeof value !== 'string') return value;
    return value.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ============================================
// FORM MESSAGE UTILITY
// ============================================
function clearFormMessages(form) {
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function showFormMessage(form, message, type) {
    // Remove existing message
    clearFormMessages(form);

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

function setFormLoading(form, isLoading) {
    const submitBtn = form.querySelector('.form-submit');
    if (!submitBtn) return;

    if (isLoading) {
        submitBtn.disabled = true;
        submitBtn.dataset.originalText = submitBtn.textContent;
        const sendingText = window.i18n ? window.i18n.t('js.form.sending') : 'Envoi...';
        submitBtn.textContent = sendingText;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
    } else {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.originalText || submitBtn.textContent;
        submitBtn.style.opacity = '1';
        submitBtn.style.cursor = 'pointer';
    }
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

