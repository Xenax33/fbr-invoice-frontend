import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import QueryProvider from "@/components/providers/query-provider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { Toaster } from 'react-hot-toast';
import DevToolsProtection from "@/components/DevToolsProtection";
import GlobalLoader from "@/components/GlobalLoader";
import LayoutContent from "@/components/layouts/LayoutContent";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://saadtraders.com'),
  title: {
    default: "Saad Traders - FBR Digital Invoicing & Premium Textile Supplies",
    template: "%s | Saad Traders"
  },
  description: "Your trusted partner for FBR-compliant digital invoicing solutions and premium quality stitching threads, dyeing materials, and textile supplies in Pakistan.",
  keywords: [
    "FBR invoice Pakistan",
    "digital invoice",
    "stitching thread Pakistan",
    "dyeing materials",
    "textile supplies",
    "Saad Traders",
    "FBR compliant invoicing",
    "embroidery thread",
    "garment supplies Pakistan"
  ],
  authors: [{ name: "Saad Traders" }],
  creator: "Saad Traders",
  publisher: "Saad Traders",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_PK",
    url: "https://saadtraders.com",
    siteName: "Saad Traders",
    title: "Saad Traders - FBR Digital Invoicing & Premium Textile Supplies",
    description: "Your trusted partner for FBR-compliant digital invoicing and premium textile supplies in Pakistan.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Saad Traders",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Saad Traders - FBR Digital Invoicing & Premium Textile Supplies",
    description: "Your trusted partner for FBR-compliant digital invoicing and premium textile supplies in Pakistan.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    // Add other verification codes as needed
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://saadtraders.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#047857" />
      </head>
      <body
        className={`${fraunces.variable} ${plusJakartaSans.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <LoadingProvider>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#047857',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <GlobalLoader />
              <DevToolsProtection />
              <LayoutContent>{children}</LayoutContent>
            </LoadingProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
