# Google Cloud Document AI Setup Guide

## Prerequisites
1. Google Cloud Project with billing enabled
2. Document AI API enabled
3. Service account with proper permissions

## Step 1: Enable Document AI API
```bash
gcloud services enable documentai.googleapis.com
```

## Step 2: Create Service Account
```bash
gcloud iam service-accounts create documentai-service \
    --description="Service account for Document AI" \
    --display-name="Document AI Service Account"
```

## Step 3: Grant Permissions
```bash
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:documentai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/documentai.apiUser"
```

## Step 4: Create and Download Service Account Key
```bash
gcloud iam service-accounts keys create ./service-account-key.json \
    --iam-account=documentai-service@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

## Step 5: Create Document AI Processor
```bash
# Go to Google Cloud Console > Document AI > Processors
# Create a new processor of type "Document OCR" or "Form Parser"
# Note down the Processor ID
```

## Step 6: Set Environment Variables
Create .env.local with:
```
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
DOCUMENT_AI_PROCESSOR_ID=your-processor-id
```