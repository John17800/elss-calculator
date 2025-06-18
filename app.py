from flask import Flask, render_template, request, jsonify
import math

app = Flask(__name__)

def calculate_sip_elss(monthly_investment, annual_rate, years):
    """Calculate ELSS SIP returns using compound interest formula"""
    monthly_rate = annual_rate / (12 * 100)
    months = years * 12
    
    if monthly_rate == 0:
        future_value = monthly_investment * months
    else:
        future_value = monthly_investment * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
    
    total_investment = monthly_investment * months
    total_returns = future_value - total_investment
    
    # Calculate tax savings (Section 80C)
    annual_investment = monthly_investment * 12
    yearly_tax_savings = []
    total_tax_saved = 0
    
    for year in range(1, years + 1):
        # Maximum deduction under Section 80C is ₹1.5 lakh per year
        deductible_amount = min(annual_investment, 150000)
        # Assuming 30% tax bracket (can be made dynamic later)
        tax_saved = deductible_amount * 0.30
        yearly_tax_savings.append(tax_saved)
        total_tax_saved += tax_saved
    
    return {
        'future_value': round(future_value, 2),
        'total_investment': round(total_investment, 2),
        'total_returns': round(total_returns, 2),
        'total_tax_saved': round(total_tax_saved, 2),
        'monthly_investment': monthly_investment,
        'annual_rate': annual_rate,
        'years': years,
        'investment_type': 'SIP'
    }

def calculate_lumpsum_elss(lumpsum_amount, annual_rate, years):
    """Calculate ELSS Lump Sum returns using compound interest formula"""
    future_value = lumpsum_amount * ((1 + annual_rate / 100) ** years)
    total_returns = future_value - lumpsum_amount
    
    # Calculate tax savings for lump sum (one-time deduction)
    deductible_amount = min(lumpsum_amount, 150000)
    # Assuming 30% tax bracket
    total_tax_saved = deductible_amount * 0.30
    
    return {
        'future_value': round(future_value, 2),
        'total_investment': round(lumpsum_amount, 2),
        'total_returns': round(total_returns, 2),
        'total_tax_saved': round(total_tax_saved, 2),
        'lumpsum_amount': lumpsum_amount,
        'annual_rate': annual_rate,
        'years': years,
        'investment_type': 'Lump Sum'
    }

def get_yearly_breakdown_elss(investment_type, amount, annual_rate, years):
    """Get year-wise breakdown for ELSS investments"""
    yearly_data = []
    
    if investment_type == 'SIP':
        monthly_rate = annual_rate / (12 * 100)
        monthly_investment = amount
        
        for year in range(1, years + 1):
            months = year * 12
            if monthly_rate == 0:
                future_value = monthly_investment * months
            else:
                future_value = monthly_investment * (((1 + monthly_rate) ** months - 1) / monthly_rate) * (1 + monthly_rate)
            
            total_investment = monthly_investment * months
            
            # Tax savings for the year
            annual_investment = monthly_investment * 12
            deductible_amount = min(annual_investment, 150000)
            tax_saved = deductible_amount * 0.30
            
            yearly_data.append({
                'year': year,
                'invested': round(total_investment, 2),
                'returns': round(future_value - total_investment, 2),
                'total': round(future_value, 2),
                'tax_saved': round(tax_saved, 2)
            })
    
    else:  # Lump Sum
        lumpsum_amount = amount
        
        for year in range(1, years + 1):
            future_value = lumpsum_amount * ((1 + annual_rate / 100) ** year)
            
            # Tax savings only in first year for lump sum
            deductible_amount = min(lumpsum_amount, 150000)
            tax_saved = deductible_amount * 0.30 if year == 1 else 0
            
            yearly_data.append({
                'year': year,
                'invested': round(lumpsum_amount, 2),
                'returns': round(future_value - lumpsum_amount, 2),
                'total': round(future_value, 2),
                'tax_saved': round(tax_saved, 2)
            })
    
    return yearly_data

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    try:
        data = request.get_json()
        investment_type = data.get('investment_type', 'SIP')
        annual_rate = float(data['annual_rate'])
        years = int(data['years'])
        
        if annual_rate < 0 or years <= 0:
            return jsonify({'error': 'Please enter valid positive values'}), 400
        
        if investment_type == 'SIP':
            monthly_investment = float(data['monthly_investment'])
            if monthly_investment <= 0:
                return jsonify({'error': 'Please enter valid monthly investment amount'}), 400
            
            result = calculate_sip_elss(monthly_investment, annual_rate, years)
            yearly_breakdown = get_yearly_breakdown_elss('SIP', monthly_investment, annual_rate, years)
        
        else:  # Lump Sum
            lumpsum_amount = float(data['lumpsum_amount'])
            if lumpsum_amount <= 0:
                return jsonify({'error': 'Please enter valid lump sum amount'}), 400
            
            result = calculate_lumpsum_elss(lumpsum_amount, annual_rate, years)
            yearly_breakdown = get_yearly_breakdown_elss('Lump Sum', lumpsum_amount, annual_rate, years)
        
        return jsonify({
            'result': result,
            'yearly_breakdown': yearly_breakdown
        })
    
    except (ValueError, KeyError) as e:
        return jsonify({'error': 'Invalid input data'}), 400
    except Exception as e:
        return jsonify({'error': 'An error occurred during calculation'}), 500

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000) 