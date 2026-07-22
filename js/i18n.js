// ============================================
// I18N MODULE - WinterFest Togo
// ============================================

class I18n {
    constructor() {
        this.currentLang = 'fr';
        this.translations = {};
        this.defaultLang = 'fr';
        this.storageKey = 'winterfest-lang';
        this.supportedLangs = ['fr', 'en'];
    }

    // ============================================
    // LANGUAGE DETECTION
    // ============================================
    detectLanguage() {
        // 1. Check localStorage
        const savedLang = localStorage.getItem(this.storageKey);
        if (savedLang && this.supportedLangs.includes(savedLang)) {
            return savedLang;
        }

        // 2. Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        if (browserLang.startsWith('fr')) {
            return 'fr';
        }

        // 3. Default to English
        return 'en';
    }

    // ============================================
    // TRANSLATION LOADING
    // ============================================
    async loadTranslations(lang) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) {
                throw new Error(`Failed to load ${lang} translations`);
            }
            this.translations[lang] = await response.json();
            console.log(`Loaded ${lang} translations:`, Object.keys(this.translations[lang]));
            console.log(`Contact section exists:`, !!this.translations[lang].contact);
            if (this.translations[lang].contact) {
                console.log(`Contact keys:`, Object.keys(this.translations[lang].contact));
                console.log(`contact.placeholder_telephone:`, this.translations[lang].contact.placeholder_telephone);
            }
            return true;
        } catch (error) {
            console.error(`Error loading ${lang} translations:`, error);
            return false;
        }
    }

    async initialize() {
        this.currentLang = this.detectLanguage();
        
        // Load current language translations
        const loaded = await this.loadTranslations(this.currentLang);
        
        // If failed, try loading default language
        if (!loaded && this.currentLang !== this.defaultLang) {
            await this.loadTranslations(this.defaultLang);
            this.currentLang = this.defaultLang;
        }

        // Wait for DOM to be ready before applying translations
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        // Apply translations to DOM
        this.applyTranslations();
        
        // Setup language switcher
        this.setupLanguageSwitcher();
        
        console.log('i18n initialized with language:', this.currentLang);
        console.log('Translations loaded:', Object.keys(this.translations[this.currentLang]).length, 'keys');
    }

    // ============================================
    // UTILITY: NESTED VALUE TRAVERSAL
    // ============================================
    getNestedValue(obj, path) {
        if (!obj || !path) return undefined;
        const keys = path.split('.');
        return keys.reduce((acc, key) => {
            return acc && acc[key] !== undefined ? acc[key] : undefined;
        }, obj);
    }

    // ============================================
    // TRANSLATION FUNCTION
    // ============================================
    t(key) {
        // 1. Try current language with nested traversal
        const currentTranslation = this.getNestedValue(this.translations[this.currentLang], key);
        if (currentTranslation !== undefined) {
            return currentTranslation;
        }

        // 2. Fall back to default language with nested traversal
        const defaultTranslation = this.getNestedValue(this.translations[this.defaultLang], key);
        if (defaultTranslation !== undefined) {
            return defaultTranslation;
        }

        // 3. Return key name as fallback
        console.warn(`Translation key not found: ${key}`);
        return key;
    }

    // ============================================
    // LANGUAGE SWITCHING
    // ============================================
    async setLanguage(lang) {
        if (!this.supportedLangs.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return false;
        }

        console.log(`Setting language to: ${lang}`);

        // Always load translations to ensure they're up to date
        const loaded = await this.loadTranslations(lang);
        if (!loaded) {
            console.error(`Failed to load ${lang} translations`);
            return false;
        }

        // Update current language
        this.currentLang = lang;
        
        // Save to localStorage
        localStorage.setItem(this.storageKey, lang);

        // Apply translations with transition
        this.applyTranslations();

        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));

        console.log(`Language changed to: ${lang}`);
        return true;
    }

    // ============================================
    // DOM UPDATES
    // ============================================
    applyTranslations() {
        // Update text content
        this.updateTextContent();
        
        // Update placeholders
        this.updatePlaceholders();
        
        // Update alt attributes
        this.updateAltText();
        
        // Update aria labels
        this.updateAriaLabels();
        
        // Update meta tags
        this.updateMetaTags();
        
        // Update document title
        this.updateTitle();
        
        // Update html lang attribute
        this.updateLangAttribute();
        
        // Update language switcher buttons
        this.updateLanguageSwitcherUI();
    }

    updateTextContent() {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation && translation !== key) {
                // Add transition class
                element.style.opacity = '0';
                setTimeout(() => {
                    element.textContent = translation;
                    element.style.opacity = '1';
                }, 150);
            } else if (translation === key) {
                console.warn(`Translation not found for key: ${key}`);
            }
        });
    }

    updatePlaceholders() {
        const elements = document.querySelectorAll('[data-i18n-placeholder]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            const translation = this.t(key);
            if (translation) {
                element.placeholder = translation;
            }
        });
    }

    updateAltText() {
        const elements = document.querySelectorAll('[data-i18n-alt]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n-alt');
            const translation = this.t(key);
            if (translation) {
                element.alt = translation;
            }
        });
    }

    updateAriaLabels() {
        const elements = document.querySelectorAll('[data-i18n-aria="true"]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.t(key);
            if (translation) {
                element.setAttribute('aria-label', translation);
            }
        });
    }

    updateMetaTags() {
        // Update meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = this.t('meta.description');
        }

        // Update meta keywords
        const metaKeywords = document.querySelector('meta[name="keywords"]');
        if (metaKeywords) {
            metaKeywords.content = this.t('meta.keywords');
        }

        // Update Open Graph tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) {
            ogTitle.content = this.t('meta.og_title');
        }

        const ogDescription = document.querySelector('meta[property="og:description"]');
        if (ogDescription) {
            ogDescription.content = this.t('meta.og_description');
        }

        const ogImageAlt = document.querySelector('meta[property="og:image:alt"]');
        if (ogImageAlt) {
            ogImageAlt.content = this.t('meta.og_image_alt');
        }

        // Update Twitter Card tags
        const twitterTitle = document.querySelector('meta[name="twitter:title"]');
        if (twitterTitle) {
            twitterTitle.content = this.t('meta.twitter_title');
        }

        const twitterDescription = document.querySelector('meta[name="twitter:description"]');
        if (twitterDescription) {
            twitterDescription.content = this.t('meta.twitter_description');
        }

        const twitterImageAlt = document.querySelector('meta[name="twitter:image:alt"]');
        if (twitterImageAlt) {
            twitterImageAlt.content = this.t('meta.twitter_image_alt');
        }

        // Update schema.org JSON-LD
        this.updateSchemaOrg();
    }

    updateSchemaOrg() {
        const schemaScripts = document.querySelectorAll('script[type="application/ld+json"]');
        schemaScripts.forEach(script => {
            try {
                const schema = JSON.parse(script.textContent);
                
                // Update Event schema
                if (schema['@type'] === 'Event') {
                    schema.name = this.t('home.hero_title');
                    schema.description = this.t('meta.description');
                }

                // Update Organization schema
                if (schema['@type'] === 'Organization') {
                    schema.name = 'WinterFest Togo';
                    schema.description = this.t('meta.description');
                }

                // Update BreadcrumbList
                if (schema['@type'] === 'BreadcrumbList') {
                    schema.itemListElement.forEach(item => {
                        if (item.name === 'Accueil') {
                            item.name = this.t('nav.home');
                        } else if (item.name === 'À propos') {
                            item.name = this.t('nav.about');
                        } else if (item.name === 'Galerie') {
                            item.name = this.t('nav.gallery');
                        } else if (item.name === 'Édition 2026') {
                            item.name = this.t('nav.event');
                        } else if (item.name === 'Témoignages') {
                            item.name = this.t('nav.testimonies');
                        } else if (item.name === 'Bénévoles') {
                            item.name = this.t('nav.volunteer');
                        } else if (item.name === 'Contact') {
                            item.name = this.t('nav.contact');
                        }
                    });
                }

                script.textContent = JSON.stringify(schema);
            } catch (error) {
                console.error('Error updating schema.org:', error);
            }
        });
    }

    updateTitle() {
        const pageKey = this.getCurrentPageKey();
        if (pageKey) {
            const title = this.t(pageKey);
            if (title && title !== pageKey) {
                document.title = title;
            }
        }
    }

    getCurrentPageKey() {
        const path = window.location.pathname;
        if (path.includes('about.html')) return 'about.title';
        if (path.includes('event.html')) return 'event.title';
        if (path.includes('contact.html')) return 'contact.title';
        if (path.includes('gallery.html')) return 'gallery.title';
        if (path.includes('testimonies.html')) return 'testimonies.title';
        if (path.includes('volunteer.html')) return 'volunteer.title';
        return 'home.title';
    }

    updateLangAttribute() {
        document.documentElement.lang = this.currentLang === 'fr' ? 'fr' : 'en';
    }

    // ============================================
    // LANGUAGE SWITCHER UI
    // ============================================
    setupLanguageSwitcher() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = button.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }

    updateLanguageSwitcherUI() {
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            if (lang === this.currentLang) {
                button.classList.add('active');
            } else {
                button.classList.remove('active');
            }
        });
    }

    // ============================================
    // DATE/NUMBER FORMATTING
    // ============================================
    formatDate(date, options = {}) {
        const locale = this.currentLang === 'fr' ? 'fr-FR' : 'en-US';
        const defaultOptions = {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        return new Intl.DateTimeFormat(locale, { ...defaultOptions, ...options }).format(date);
    }

    formatNumber(number, options = {}) {
        const locale = this.currentLang === 'fr' ? 'fr-FR' : 'en-US';
        return new Intl.NumberFormat(locale, options).format(number);
    }

    // ============================================
    // DYNAMIC CONTENT SUPPORT
    // ============================================
    getBilingualContent(content, field) {
        if (typeof content === 'string') {
            return content;
        }
        if (content && content[this.currentLang]) {
            return content[this.currentLang];
        }
        if (content && content[this.defaultLang]) {
            return content[this.defaultLang];
        }
        return '';
    }
}

// ============================================
    // GLOBAL INSTANCE
    // ============================================
const i18n = new I18n();

// ============================================
    // INITIALIZE ON DOM READY
    // ============================================
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.initialize());
} else {
    i18n.initialize();
}

// ============================================
    // MAKE AVAILABLE GLOBALLY
    // ============================================
window.i18n = i18n;
window.t = (key) => i18n.t(key);
