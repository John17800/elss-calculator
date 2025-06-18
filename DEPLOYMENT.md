# SIP Calculator - Vercel Deployment Guide

This guide will help you deploy the SIP Calculator website to Vercel.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Git Repository**: Push your code to GitHub, GitLab, or Bitbucket
3. **Vercel CLI** (optional): `npm i -g vercel`

## Project Structure for Vercel

```
Sipcalculator/
├── api/
│   └── index.py          # Main Flask app for Vercel
├── static/               # CSS, JS, images
├── templates/            # HTML templates
├── vercel.json          # Vercel configuration
├── requirements.txt     # Python dependencies
├── .vercelignore       # Files to ignore during deployment
└── DEPLOYMENT.md       # This file
```

## Deployment Methods

### Method 1: Vercel Dashboard (Recommended)

1. **Connect Repository**:
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository

2. **Configure Project**:
   - Framework Preset: "Other"
   - Root Directory: "./"
   - Build Settings: Leave default (Vercel will auto-detect)

3. **Deploy**:
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### Method 2: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from project directory**:
   ```bash
   cd Sipcalculator
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? Y
   - Which scope? (select your account)
   - Link to existing project? N
   - Project name: sip-calculator (or your preferred name)
   - Directory: ./
   - Override settings? N

### Method 3: Git Integration

1. **Push to Git**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/sipcalculator.git
   git push -u origin main
   ```

2. **Import in Vercel**:
   - Go to Vercel dashboard
   - Click "New Project"
   - Import from Git

## Environment Variables (if needed)

If you need to set environment variables:

1. **In Vercel Dashboard**:
   - Go to Project Settings
   - Navigate to Environment Variables
   - Add variables like:
     - `FLASK_ENV=production`
     - `FLASK_DEBUG=False`

2. **Using Vercel CLI**:
   ```bash
   vercel env add FLASK_ENV production
   ```

## Custom Domain (Optional)

1. **Add Domain**:
   - Go to Project Settings
   - Navigate to Domains
   - Add your custom domain

2. **Configure DNS**:
   - Point your domain's DNS to Vercel
   - Follow Vercel's DNS configuration guide

## Configuration Files Explained

### `vercel.json`
- Configures how Vercel builds and deploys your app
- Specifies Python runtime and routing rules
- Includes template files in the build

### `api/index.py`
- Modified Flask app for Vercel's serverless environment
- Uses relative paths for templates and static files
- Contains all your original Flask routes and logic

### `.vercelignore`
- Lists files/folders to exclude from deployment
- Reduces deployment size and build time
- Excludes development files and cache

## Troubleshooting

### Common Issues:

1. **Template Not Found**:
   - Ensure templates are in `/templates` directory
   - Check template paths in `api/index.py`

2. **Static Files Not Loading**:
   - Verify static files are in `/static` directory
   - Check routing in `vercel.json`

3. **Import Errors**:
   - Ensure all dependencies are in `requirements.txt`
   - Check Python version compatibility

4. **Build Failures**:
   - Check Vercel build logs
   - Verify `vercel.json` configuration
   - Ensure no syntax errors in Python code

### Getting Help:

- **Vercel Documentation**: [vercel.com/docs](https://vercel.com/docs)
- **Vercel Community**: [github.com/vercel/vercel/discussions](https://github.com/vercel/vercel/discussions)
- **Flask on Vercel**: [vercel.com/guides/using-flask-with-vercel](https://vercel.com/guides/using-flask-with-vercel)

## Success!

Once deployed, your SIP Calculator will be available at:
- **Vercel URL**: `https://your-project-name.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (if configured)

## Features That Work:

✅ SIP Calculations
✅ Interactive Charts (Chart.js)
✅ Responsive Design
✅ All Navigation Pages
✅ Form Validation
✅ Animations and Effects

Your SIP Calculator is now live and accessible worldwide! 🚀 