// Main JavaScript for SIP Calculator

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeNavigation();
    initializeTooltips();
});

// Animation initialization
function initializeAnimations() {
    // Add fade-in animation to elements as they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .summary-card, .hero-content');
    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// Navigation functionality
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');

    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

// Initialize tooltips
function initializeTooltips() {
    // Add tooltips to form inputs
    const inputs = document.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Utility functions
function formatCurrency(amount) {
    return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(amount));
}

function formatNumber(num) {
    return new Intl.NumberFormat('en-IN').format(num);
}

// Loading overlay functions
function showLoading() {
    const loadingOverlay = document.getElementById('loadingSpinner');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('d-none');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingSpinner');
    if (loadingOverlay) {
        loadingOverlay.classList.add('d-none');
    }
}

// Error handling
function showError(message) {
    // Create error alert
    const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
            <i class="fas fa-exclamation-triangle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = alertHtml;
    
    // Insert at top of main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertContainer.firstElementChild, mainContent.firstChild);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            const alert = mainContent.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 5000);
    }
}

// Success message
function showSuccess(message) {
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
            <i class="fas fa-check-circle me-2"></i>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    const alertContainer = document.createElement('div');
    alertContainer.innerHTML = alertHtml;
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.insertBefore(alertContainer.firstElementChild, mainContent.firstChild);
        
        setTimeout(() => {
            const alert = mainContent.querySelector('.alert');
            if (alert) {
                alert.remove();
            }
        }, 3000);
    }
}

// Form validation for ELSS
function validateELSSForm(formData) {
    const errors = [];
    
    if (formData.investment_type === 'SIP') {
        if (!formData.monthly_investment || formData.monthly_investment < 500) {
            errors.push('Monthly investment must be at least ₹500');
        }
        if (formData.monthly_investment > 500000) {
            errors.push('Monthly investment cannot exceed ₹5,00,000');
        }
    } else {
        if (!formData.lumpsum_amount || formData.lumpsum_amount < 1000) {
            errors.push('Lump sum amount must be at least ₹1,000');
        }
        if (formData.lumpsum_amount > 10000000) {
            errors.push('Lump sum amount cannot exceed ₹1,00,00,000');
        }
    }
    
    if (!formData.annual_rate || formData.annual_rate < 8 || formData.annual_rate > 20) {
        errors.push('Expected annual return must be between 8% and 20%');
    }
    
    if (!formData.years || formData.years < 3 || formData.years > 50) {
        errors.push('Investment period must be between 3 and 50 years (minimum 3 years for ELSS lock-in)');
    }
    
    return errors;
}

// Number input formatting
function formatNumberInput(input) {
    input.addEventListener('input', function() {
        // Remove non-numeric characters except decimal point
        let value = this.value.replace(/[^0-9.]/g, '');
        
        // Ensure only one decimal point
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }
        
        this.value = value;
    });
}

// Initialize number input formatting
document.addEventListener('DOMContentLoaded', function() {
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(formatNumberInput);
});

// Responsive chart handling
function handleChartResize() {
    window.addEventListener('resize', function() {
        // Trigger chart resize if chart exists
        if (window.sipChart) {
            window.sipChart.resize();
        }
    });
}

// Initialize chart resize handling
document.addEventListener('DOMContentLoaded', handleChartResize);

// Accessibility improvements
function initializeAccessibility() {
    // Add keyboard navigation for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
    // Add ARIA labels dynamically
    const inputs = document.querySelectorAll('input, select');
    inputs.forEach(input => {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (label && !input.getAttribute('aria-label')) {
            input.setAttribute('aria-label', label.textContent.trim());
        }
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initializeAccessibility);

// Export utility functions for use in other scripts
window.SIPCalculator = {
    formatCurrency,
    formatNumber,
    showLoading,
    hideLoading,
    showError,
    showSuccess,
    validateForm
}; 