# ELSS Calculator 🛡️💰

A comprehensive **Equity Linked Savings Scheme (ELSS) Calculator** built with Flask and modern web technologies. Calculate your tax-saving investments with both SIP and Lump Sum options while visualizing returns and tax benefits.

[![Python](https://img.shields.io/badge/Python-3.7%2B-blue)](https://python.org)
[![Flask](https://img.shields.io/badge/Flask-2.3.3-green)](https://flask.palletsprojects.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple)](https://getbootstrap.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-Latest-orange)](https://www.chartjs.org/)

## 🌟 Features

### Investment Modes
- **SIP Calculator**: Systematic Investment Plan with monthly contributions
- **Lump Sum Calculator**: One-time investment calculations

### Tax Benefits
- **Section 80C Deduction**: Automatic calculation up to ₹1.5 lakh
- **Tax Savings Display**: Shows potential savings in 30% tax bracket
- **Net Investment Cost**: Real cost after tax benefits

### Advanced Analytics
- **Interactive Charts**: Visualize growth with Chart.js
- **Year-wise Breakdown**: Detailed investment progression
- **Real-time Calculations**: Instant results as you type
- **Responsive Design**: Works on all devices

### Key Highlights
- ✅ Tax savings up to ₹46,800 annually
- ✅ 3-year lock-in period (shortest among tax-saving options)
- ✅ Potential for high equity returns
- ✅ Modern, intuitive UI/UX
- ✅ Mobile-responsive design

## 🚀 Live Demo

Visit the live application: [ELSS Calculator Demo](https://your-app-url.vercel.app)

## 📸 Screenshots

### Calculator Interface
![ELSS Calculator Main Interface](https://via.placeholder.com/800x400/0891b2/ffffff?text=ELSS+Calculator+Interface)

### Results Dashboard
![Results with Charts](https://via.placeholder.com/800x400/10b981/ffffff?text=Results+Dashboard)

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.7 or higher
- pip (Python package installer)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/elss-calculator.git
   cd elss-calculator
   ```

2. **Create a virtual environment**
   ```bash
   python -m venv venv
   
   # On Windows
   venv\Scripts\activate
   
   # On macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open in browser**
   ```
   http://localhost:5000
   ```

## 📁 Project Structure

```
elss-calculator/
├── api/
│   └── index.py              # Vercel deployment API
├── static/
│   ├── css/
│   │   └── style.css         # Custom styles
│   └── js/
│       ├── calculator.js     # Main calculator logic
│       └── main.js          # Utility functions
├── templates/
│   ├── base.html            # Base template
│   ├── index.html           # Main calculator page
│   ├── about.html           # About ELSS information
│   └── contact.html         # Contact page
├── app.py                   # Main Flask application
├── requirements.txt         # Python dependencies
├── vercel.json             # Vercel deployment config
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🧮 ELSS Calculation Formulas

### SIP Formula
```
FV = P × [((1 + r)^n - 1) / r] × (1 + r)
```
Where:
- **FV** = Future Value
- **P** = Monthly Investment
- **r** = Monthly Rate of Return
- **n** = Number of Months

### Lump Sum Formula
```
FV = P × (1 + r)^n
```
Where:
- **FV** = Future Value
- **P** = Principal Amount
- **r** = Annual Rate of Return
- **n** = Number of Years

### Tax Savings
```
Tax Saved = min(Investment, ₹1,50,000) × Tax Rate
```

## 💡 Usage Examples

### SIP Investment Example
- **Monthly Investment**: ₹5,000
- **Investment Period**: 10 years
- **Expected Return**: 12% p.a.
- **Total Investment**: ₹6,00,000
- **Tax Savings**: ₹1,80,000 (over 10 years)
- **Maturity Value**: ₹11,61,695
- **Net Gain**: ₹5,61,695

### Lump Sum Investment Example
- **Investment Amount**: ₹1,50,000
- **Investment Period**: 5 years
- **Expected Return**: 12% p.a.
- **Tax Savings**: ₹45,000 (one-time)
- **Maturity Value**: ₹2,64,600
- **Net Gain**: ₹1,14,600

## 🌐 Deployment

### Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

### Deploy to Heroku

1. **Create Procfile**
   ```
   web: gunicorn app:app
   ```

2. **Deploy to Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

## 🔧 Configuration

### Environment Variables
```bash
# Optional: Set Flask environment
FLASK_ENV=development  # or production
FLASK_DEBUG=True       # or False
```

### Customization
- **Tax Rate**: Modify the tax calculation in `app.py` (currently set to 30%)
- **Return Rates**: Adjust min/max expected returns in validation
- **Styling**: Customize colors and themes in `static/css/style.css`

## 📊 API Endpoints

### POST /calculate
Calculate ELSS returns and tax savings

**Request Body:**
```json
{
  "investment_type": "SIP",  // or "Lump Sum"
  "monthly_investment": 5000,  // for SIP
  "lumpsum_amount": 50000,     // for Lump Sum
  "annual_rate": 12,
  "years": 10
}
```

**Response:**
```json
{
  "result": {
    "future_value": 1161695.43,
    "total_investment": 600000,
    "total_returns": 561695.43,
    "total_tax_saved": 180000,
    "investment_type": "SIP"
  },
  "yearly_breakdown": [...]
}
```

## 🧪 Testing

Run the calculator with sample data:
```bash
python -c "
from app import calculate_sip_elss
result = calculate_sip_elss(5000, 12, 10)
print(f'Future Value: ₹{result[\"future_value\"]:,.2f}')
"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

- **Email**: your.email@example.com
- **GitHub Issues**: [Create an issue](https://github.com/yourusername/elss-calculator/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/elss-calculator/wiki)

## 🏷️ Tags

`elss` `calculator` `tax-saving` `investment` `sip` `mutual-funds` `flask` `python` `bootstrap` `chart-js` `section-80c` `finance` `wealth-management`

---

**⚡ Built with ❤️ for smart investors who want to maximize their tax savings while building wealth through ELSS investments.** 