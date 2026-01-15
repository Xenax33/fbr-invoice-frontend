# Saad Traders - Business Website

A modern, responsive website for Saad Traders offering FBR-compliant digital invoicing solutions and premium textile supplies.

## 🌟 Features

- **Fully Responsive Design** - Works seamlessly on all devices (mobile, tablet, desktop)
- **SEO Optimized** - Complete SEO setup with metadata, sitemap, robots.txt
- **Fast Performance** - Built with Next.js 16 for optimal performance
- **Modern UI** - Clean, professional design with smooth animations
- **Contact Integration** - EmailJS integration and WhatsApp direct messaging
- **Accessibility** - WCAG compliant with keyboard navigation support

## 📄 Pages

1. **Home** - Business overview and services showcase
2. **Digital Invoice Services** - FBR-compliant invoicing solutions
3. **Stitching Services** - Premium textile supplies and materials
4. **Contact Us** - Contact form with EmailJS and WhatsApp integration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd n:\FBR\fbr-invoice-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📧 EmailJS Setup

To enable the contact form, you need to set up EmailJS:

1. Go to [EmailJS.com](https://www.emailjs.com/) and create a free account
2. Create an email service (Gmail, Outlook, etc.)
3. Create an email template
4. Get your credentials:
   - Service ID
   - Template ID
   - Public Key

5. Update the credentials in `app/contact/page.tsx`:
   ```typescript
   const result = await emailjs.send(
     'YOUR_SERVICE_ID',    // Replace with your Service ID
     'YOUR_TEMPLATE_ID',   // Replace with your Template ID
     { ...formData },
     'YOUR_PUBLIC_KEY'     // Replace with your Public Key
   );
   ```

### EmailJS Template Variables

Your email template should include these variables:
- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{phone}}` - Phone number
- `{{subject}}` - Message subject
- `{{message}}` - Message content

## 🎨 Adding Images and Logos

### Logo
Replace the placeholder "ST" logo by editing `components/layouts/Header.tsx` and `components/layouts/Footer.tsx`:

```tsx
// Current placeholder:
<div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center">
  <span className="text-white font-bold text-xl">ST</span>
</div>

// Replace with:
<Image 
  src="/logo.png" 
  alt="Saad Traders Logo" 
  width={40} 
  height={40}
  className="rounded-lg"
/>
```

### Adding Images to Pages

Place images in the `public` folder and reference them:

```tsx
import Image from 'next/image';

<Image 
  src="/your-image.jpg" 
  alt="Description" 
  width={800} 
  height={600}
  className="rounded-lg"
/>
```

### Recommended Images
- `/public/logo.png` - Company logo (40x40px minimum)
- `/public/og-image.jpg` - Social media preview (1200x630px)
- Service images for each page
- Product images for stitching services

## 🔧 Customization

### Colors
The website uses a blue color scheme. To change colors, update the Tailwind classes:
- Primary: `bg-blue-600`, `text-blue-600`
- Hover: `hover:bg-blue-700`

### Content
Update text content in each page file:
- `app/page.tsx` - Home page
- `app/digital-invoice/page.tsx` - Digital invoice service
- `app/stitching-services/page.tsx` - Stitching services
- `app/contact/page.tsx` - Contact page

### SEO Settings
Update SEO metadata in `app/layout.tsx`:
- Change `https://saadtraders.com` to your actual domain
- Update business information
- Add Google verification code

## 📱 WhatsApp Integration

The website includes WhatsApp integration with the number: **+92 318 4489249**

To change the WhatsApp number, find and replace all instances of:
```
https://wa.me/923184489249
+92 318 4489249
```

## 🏗️ Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📊 SEO Features

- ✅ Meta tags (title, description, keywords)
- ✅ Open Graph tags (Facebook, LinkedIn)
- ✅ Twitter Card tags
- ✅ Canonical URLs
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Structured data ready
- ✅ Mobile-friendly
- ✅ Fast loading times
- ✅ Semantic HTML

## 🎯 Performance

- Server-side rendering (SSR)
- Optimized images with Next.js Image component
- Code splitting
- Lazy loading
- Minimal JavaScript bundle

## 📞 Contact Information

**WhatsApp**: +92 318 4489249  
**Location**: Pakistan

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Forms**: EmailJS
- **State Management**: React Query (TanStack Query v5)
- **HTTP Client**: Axios
- **Deployment Ready**: Vercel, Netlify, or any Node.js hosting

## 📁 Project Structure

```
├── app/
│   ├── contact/              # Contact page with form
│   ├── digital-invoice/      # Digital invoice service page
│   ├── stitching-services/   # Stitching services page
│   ├── layout.tsx            # Root layout with SEO
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Global styles
│   ├── sitemap.ts            # Auto-generated sitemap
│   ├── robots.ts             # Robots.txt configuration
│   └── opengraph-image.tsx   # OG image generator
├── components/
│   ├── layouts/
│   │   ├── Header.tsx        # Navigation header
│   │   └── Footer.tsx        # Footer with links
│   ├── providers/
│   │   └── query-provider.tsx
│   └── ui/
│       └── Cards.tsx         # Reusable card components
├── lib/
│   ├── axios.ts
│   ├── query-client.ts
│   └── utils.ts
└── public/                   # Static assets (add your images here)
```

## 📝 License

© 2026 Saad Traders. All rights reserved.

## 🤝 Support

For technical support or questions:
- WhatsApp: +92 318 4489249
- Create an issue in the repository

---

**Built with ❤️ for Saad Traders**
