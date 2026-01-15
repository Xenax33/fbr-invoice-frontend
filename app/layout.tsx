import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import QueryProvider from "@/components/providers/query-provider";
import Header from "@/components/layouts/Header";
import Footer from "@/components/layouts/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
        <meta name="theme-color" content="#2563eb" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
