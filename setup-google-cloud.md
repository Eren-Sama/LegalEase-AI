# 🚀 Google Cloud Document AI Setup Guide

Follow these steps to enable real AI document analysis instead of mock data.

## 📋 Prerequisites
- Google Cloud Account
- Billing enabled on your Google Cloud project
- Basic command line familiarity

## 🔧 Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create New Project**
   - Click "Select a project" → "New Project"
   - Project Name: `legalease-ai` (or your preferred name)
   - Copy the Project ID (it will be auto-generated like `legalease-ai-123456`)

## 📄 Step 2: Enable Document AI API

1. **Navigate to APIs & Services**
   - Go to: https://console.cloud.google.com/apis/library
   - Search for "Document AI API"
   - Click "Document AI API" → Click "ENABLE"

2. **Wait for API to be enabled** (takes 1-2 minutes)

## 🔑 Step 3: Create Service Account

1. **Go to IAM & Admin → Service Accounts**
   - Visit: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Click "CREATE SERVICE ACCOUNT"

2. **Service Account Details**
   - Name: `legalease-document-ai`
   - Description: `Service account for LegalEase AI document processing`
   - Click "CREATE AND CONTINUE"

3. **Grant Roles**
   - Add Role: `Document AI API User`
   - Add Role: `Storage Object Viewer` (if using Cloud Storage)
   - Click "CONTINUE" → "DONE"

## 🗝️ Step 4: Create Service Account Key

1. **Find your service account**
   - In Service Accounts list, click on `legalease-document-ai`

2. **Create JSON Key**
   - Go to "Keys" tab → "ADD KEY" → "Create new key"
   - Select "JSON" format → Click "CREATE"
   - **Important**: File will download automatically (e.g., `legalease-ai-123456-abcdef.json`)

3. **Secure the Key File**
   - Move the downloaded JSON file to your project root: `d:\GenAI\legalease-ai\`
   - Rename it to: `service-account-key.json`
   - ⚠️ **Never commit this file to version control!**

## 🔧 Step 5: Create Document AI Processor

1. **Go to Document AI**
   - Visit: https://console.cloud.google.com/ai/document-ai/processors
   - Select your project if prompted

2. **Create Processor**
   - Click "CREATE PROCESSOR"
   - Type: **"Document OCR"** (recommended for general documents)
   - Processor Name: `legalease-processor`
   - Region: `us-central1` (recommended)
   - Click "CREATE"

3. **Copy Processor Details**
   - After creation, you'll see Processor ID (format: `abc123def456ghi789`)
   - Copy this ID - you'll need it for configuration

## ⚙️ Step 6: Update Environment Configuration

1. **Edit your `.env.local` file** with actual values:

```bash
# Update these with your actual values:
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id-here
GOOGLE_CLOUD_LOCATION=us-central1
DOCUMENT_AI_PROCESSOR_ID=your-actual-processor-id-here
```

2. **Example with real values**:
```bash
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=legalease-ai-123456
GOOGLE_CLOUD_LOCATION=us-central1
DOCUMENT_AI_PROCESSOR_ID=abc123def456ghi789
```

## ✅ Step 7: Verify Setup

1. **Restart your development server**:
   ```powershell
   npm run dev
   ```

2. **Check health endpoint**:
   ```powershell
   curl http://localhost:3000/api/health
   ```

3. **Look for success message**:
   - ✅ Should show: `"Google Cloud Document AI: Configured ✓"`
   - ❌ If still showing mock: Check your file paths and IDs

## 🛠️ Troubleshooting

### Common Issues:

1. **"Service account key file not found"**
   - Ensure `service-account-key.json` is in project root
   - Check file path in `GOOGLE_APPLICATION_CREDENTIALS`

2. **"Permission denied"**
   - Verify service account has `Document AI API User` role
   - Check if Document AI API is enabled

3. **"Processor not found"**
   - Verify `DOCUMENT_AI_PROCESSOR_ID` is correct
   - Ensure processor region matches `GOOGLE_CLOUD_LOCATION`

4. **"Project not found"**
   - Double-check `GOOGLE_CLOUD_PROJECT_ID` 
   - Ensure billing is enabled on the project

### Getting Help:
- Check Google Cloud Console for any error messages
- Verify all APIs are enabled and billing is set up
- Ensure service account key JSON is valid and not corrupted

## 🎉 Success!
Once configured correctly, your app will show:
- Real AI confidence scores (not 87-95% mock scores)
- Actual extracted text from documents
- Real entity recognition and legal term identification
- Authentic document classification and analysis

The app will automatically switch from mock to real AI processing once Google Cloud is properly configured!