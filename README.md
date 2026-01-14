# FBR Invoice Pro - Frontend

A professional FBR-compliant digital invoice management system for Pakistani businesses.

## 🎨 Design Overview

The frontend is designed with a modern, clean aesthetic inspired by QuickBooks, featuring:
- **Emerald Green** primary color scheme (#059669)
- Professional, business-focused UI
- Fully responsive design
- QuickBooks-style layout and components

## 🖼️ Image Placeholders

The following sections have placeholders where you should add your images:

### 1. **Hero Section - Invoice Preview** (Landing Page)
- **Location**: Home page hero section (right side)
- **Current**: Mockup invoice card with placeholder data
- **Suggested**: Screenshot of an actual FBR-validated invoice
- **File**: `app/page.tsx` (lines ~90-120)

### 2. **FBR Integration Section**
- **Location**: Landing page, "Direct FBR Portal Integration" section
- **Current**: Gray placeholder box with FileText icon
- **Suggested**: 
  - FBR official logo
  - Screenshot of FBR portal interface
  - Infographic showing the integration flow
- **File**: `app/page.tsx` (lines ~235-250)
- **Recommended size**: 1000x600px

### 3. **Invoice Screenshot Section**
- **Location**: Landing page, dark section with "Professional FBR-Compliant Invoices"
- **Current**: Large white box with FileText icon
- **Suggested**: 
  - Full screenshot of a completed, FBR-validated invoice
  - Show all invoice details clearly
- **File**: `app/page.tsx` (lines ~440-455)
- **Recommended size**: 1200x800px

## 📁 Adding Images

### Step 1: Add images to the public folder
```bash
public/
  ├── fbr-logo.png          # FBR official logo
  ├── invoice-sample.png    # Sample invoice screenshot
  ├── fbr-portal.png        # FBR portal screenshot
  └── invoice-preview.png   # Invoice preview for hero
```

### Step 2: Update the code

Replace the placeholder div in `app/page.tsx`:

**For FBR Logo/Portal Integration:**
```tsx
// Replace this:
<div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-12...">
  <div className="w-full h-64 bg-slate-200 rounded-lg...">
    <FileText className="w-24 h-24 mx-auto mb-4 opacity-50" />
  </div>
</div>

// With this:
<div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-12 text-center border border-slate-200">
  <Image 
    src="/fbr-portal.png" 
    alt="FBR Portal Integration" 
    width={1000} 
    height={600}
    className="rounded-lg shadow-lg"
  />
  <p className="text-sm text-slate-600 mt-4">
    Validated and verified through official FBR systems
  </p>
</div>
```

**For Invoice Screenshot:**
```tsx
// Replace this:
<div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto p-12">
  <div className="text-slate-400 text-center">
    <FileText className="w-32 h-32 mx-auto mb-6 opacity-30" />
  </div>
</div>

// With this:
<div className="bg-white rounded-xl shadow-2xl max-w-4xl mx-auto">
  <Image 
    src="/invoice-sample.png" 
    alt="FBR Digital Invoice Sample" 
    width={1200} 
    height={800}
    className="rounded-xl"
  />
</div>
```

## 🚀 Running the Project

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Open http://localhost:3000

## ✨ Features

### For Users:
- ✅ Create FBR-compliant digital invoices
- ✅ Real-time validation with FBR portal
- ✅ Track and manage all invoices
- ✅ PDF export functionality
- ✅ Secure cloud storage
- ✅ User-friendly interface

### Technical:
- ✅ Next.js 16 with App Router
- ✅ TypeScript for type safety
- ✅ Tailwind CSS for styling
- ✅ EmailJS integration for contact form
- ✅ Authentication with protected routes
- ✅ Responsive design
- ✅ Modern, professional UI

## 📧 EmailJS Setup

To enable the contact form:

1. Sign up at https://www.emailjs.com/
2. Create an email service
3. Create an email template
4. Update credentials in `app/contact/page.tsx`:
   - `SERVICE_ID`
   - `TEMPLATE_ID`
   - `PUBLIC_KEY`

## 🎯 Focus Areas

This platform focuses specifically on:
- **Creating** FBR digital invoices
- **Validating** invoices with FBR portal
- **Managing** invoice records

We do NOT handle:
- ❌ Tax calculations (handled by FBR portal)
- ❌ Payment processing
- ❌ Accounting features
- ❌ Inventory management

## 📱 Contact Information

Update your contact details in:
- `app/page.tsx` (footer and CTA sections)
- `app/contact/page.tsx` (contact info sidebar)

Default placeholders:
- Email: support@fbrinvoice.com
- Phone: +92 300 1234567
- WhatsApp: +92 300 1234567

## 🎨 Color Scheme

Primary Colors:
- **Emerald 600**: `#059669` - Primary actions, branding
- **Emerald 700**: `#047857` - Sidebar, darker accents
- **Emerald 50**: `#ecfdf5` - Light backgrounds

Secondary Colors:
- **Slate 900**: `#0f172a` - Text, dark sections
- **Slate 600**: `#475569` - Secondary text
- **Slate 50**: `#f8fafc` - Page backgrounds

## 📄 License

© 2026 FBR Invoice Pro. All rights reserved.
