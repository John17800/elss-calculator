// ELSS Calculator JavaScript with Chart.js integration

let elssChart = null;
let currentInvestmentType = 'SIP';

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCalculator();
    initializeChart();
    initializeInvestmentToggle();
});

function initializeCalculator() {
    const form = document.getElementById('elssForm');
    if (!form) return;

    form.addEventListener('submit', handleFormSubmit);
    
    // Add real-time calculation on input change
    const inputs = form.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('input', debounce(handleInputChange, 500));
    });
}

function initializeInvestmentToggle() {
    const sipRadio = document.getElementById('sipType');
    const lumpSumRadio = document.getElementById('lumpSumType');
    const sipFields = document.getElementById('sipFields');
    const lumpSumFields = document.getElementById('lumpSumFields');

    sipRadio.addEventListener('change', function() {
        if (this.checked) {
            currentInvestmentType = 'SIP';
            sipFields.classList.remove('d-none');
            lumpSumFields.classList.add('d-none');
            hideResults();
        }
    });

    lumpSumRadio.addEventListener('change', function() {
        if (this.checked) {
            currentInvestmentType = 'Lump Sum';
            sipFields.classList.add('d-none');
            lumpSumFields.classList.remove('d-none');
            hideResults();
        }
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    calculateELSS();
}

function handleInputChange() {
    // Optional: Real-time calculation as user types
    // calculateELSS();
}

function hideResults() {
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.add('d-none');
}

function calculateELSS() {
    const annualRate = parseFloat(document.getElementById('annualRate').value);
    const years = parseInt(document.getElementById('years').value);

    let formData = {
        investment_type: currentInvestmentType,
        annual_rate: annualRate,
        years: years
    };

    if (currentInvestmentType === 'SIP') {
        const monthlyInvestment = parseFloat(document.getElementById('monthlyInvestment').value);
        formData.monthly_investment = monthlyInvestment;
    } else {
        const lumpSumAmount = parseFloat(document.getElementById('lumpSumAmount').value);
        formData.lumpsum_amount = lumpSumAmount;
    }

    const validationErrors = validateELSSForm(formData);
    if (validationErrors.length > 0) {
        showError(validationErrors.join('<br>'));
        return;
    }

    // Show loading
    showLoading();

    // Make API call to calculate ELSS
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        hideLoading();
        if (data.error) {
            showError(data.error);
        } else {
            displayResults(data.result, data.yearly_breakdown);
            scrollToResults();
        }
    })
    .catch(error => {
        hideLoading();
        showError('An error occurred while calculating. Please try again.');
        console.error('Error:', error);
    });
}

function displayResults(result, yearlyBreakdown) {
    // Update summary cards
    document.getElementById('totalInvestment').textContent = formatCurrency(result.total_investment);
    document.getElementById('totalReturns').textContent = formatCurrency(result.total_returns);
    document.getElementById('finalAmount').textContent = formatCurrency(result.future_value);
    document.getElementById('taxSavings').textContent = formatCurrency(result.total_tax_saved);

    // Update investment summary
    document.getElementById('investmentTypeSummary').textContent = result.investment_type;
    document.getElementById('expectedReturnsSummary').textContent = `${result.annual_rate}% p.a.`;
    document.getElementById('investmentPeriodSummary').textContent = `${result.years} years`;

    // Update investment type specific fields
    if (result.investment_type === 'SIP') {
        document.getElementById('monthlyAmountRow').style.display = 'flex';
        document.getElementById('lumpSumAmountRow').style.display = 'none';
        document.getElementById('monthlyAmountSummary').textContent = formatCurrency(result.monthly_investment);
        
        // Annual deduction for SIP
        const annualInvestment = result.monthly_investment * 12;
        const deductibleAmount = Math.min(annualInvestment, 150000);
        document.getElementById('annualDeduction').textContent = formatCurrency(deductibleAmount);
        document.getElementById('annualTaxSaved').textContent = formatCurrency(deductibleAmount * 0.30);
    } else {
        document.getElementById('monthlyAmountRow').style.display = 'none';
        document.getElementById('lumpSumAmountRow').style.display = 'flex';
        document.getElementById('lumpSumAmountSummary').textContent = formatCurrency(result.lumpsum_amount);
        
        // Annual deduction for Lump Sum
        const deductibleAmount = Math.min(result.lumpsum_amount, 150000);
        document.getElementById('annualDeduction').textContent = formatCurrency(deductibleAmount);
        document.getElementById('annualTaxSaved').textContent = formatCurrency(deductibleAmount * 0.30);
    }

    // Show results section
    const resultsSection = document.getElementById('resultsSection');
    resultsSection.classList.remove('d-none');

    // Create chart
    createChart(yearlyBreakdown);

    // Add animation to summary cards
    animateSummaryCards();
}

function createChart(yearlyBreakdown) {
    const ctx = document.getElementById('elssChart').getContext('2d');

    // Destroy existing chart if it exists
    if (elssChart) {
        elssChart.destroy();
    }

    const years = yearlyBreakdown.map(item => `Year ${item.year}`);
    const investedAmounts = yearlyBreakdown.map(item => item.invested);
    const returnsAmounts = yearlyBreakdown.map(item => item.returns);
    const taxSavings = yearlyBreakdown.map(item => item.tax_saved);

    const chartData = {
        labels: years,
        datasets: [
            {
                label: 'Total Invested',
                data: investedAmounts,
                backgroundColor: 'rgba(8, 145, 178, 0.8)',
                borderColor: 'rgba(8, 145, 178, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Returns Generated',
                data: returnsAmounts,
                backgroundColor: 'rgba(16, 185, 129, 0.8)',
                borderColor: 'rgba(16, 185, 129, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            },
            {
                label: 'Tax Savings',
                data: taxSavings,
                backgroundColor: 'rgba(6, 182, 212, 0.8)',
                borderColor: 'rgba(6, 182, 212, 1)',
                borderWidth: 2,
                borderRadius: 8,
                borderSkipped: false,
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'ELSS Investment Growth & Tax Savings Over Time',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    usePointStyle: true,
                    font: {
                        size: 14
                    }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: 'rgba(8, 145, 178, 1)',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = formatCurrency(context.parsed.y);
                        return `${label}: ${value}`;
                    },
                    footer: function(tooltipItems) {
                        let totalValue = 0;
                        let taxSavings = 0;
                        tooltipItems.forEach(item => {
                            if (item.datasetIndex === 0 || item.datasetIndex === 1) {
                                totalValue += item.parsed.y;
                            } else if (item.datasetIndex === 2) {
                                taxSavings = item.parsed.y;
                            }
                        });
                        return [
                            `Portfolio Value: ${formatCurrency(totalValue)}`,
                            `Tax Savings: ${formatCurrency(taxSavings)}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                },
                ticks: {
                    font: {
                        size: 12
                    },
                    callback: function(value) {
                        return '₹' + new Intl.NumberFormat('en-IN', {
                            notation: 'compact',
                            maximumFractionDigits: 1
                        }).format(value);
                    }
                }
            }
        },
        interaction: {
            intersect: false,
            mode: 'index'
        }
    };

    elssChart = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
}

function animateSummaryCards() {
    const summaryCards = document.querySelectorAll('.summary-card');
    summaryCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100);
        }, index * 100);
    });
}

function scrollToResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (resultsSection) {
        resultsSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

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

// Utility functions
function formatCurrency(amount) {
    return '₹' + new Intl.NumberFormat('en-IN').format(Math.round(amount));
}

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

function initializeChart() {
    // Chart initialization if needed
    const canvas = document.getElementById('elssChart');
    if (canvas) {
        canvas.height = 300;
    }
}

// Export functions for testing or external use
window.ELSSCalculator = {
    calculateELSS,
    createChart,
    displayResults,
    formatCurrency
}; 