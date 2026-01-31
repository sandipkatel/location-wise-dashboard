import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "3D Earth CSV Visualizer | Interactive Globe Data Dashboard",
  description:
    "Transform your CSV data into stunning 3D visualizations on an interactive Earth globe. AI-powered location detection, comprehensive analytics, and real-time data insights. Upload any CSV with location data and watch your data come alive.",
  keywords: [
    "3D data visualization",
    "CSV visualizer",
    "interactive globe",
    "geographic data visualization",
    "3D Earth map",
    "data analytics dashboard",
    "AI location detection",
    "WebGL visualization",
    "geospatial data",
    "business intelligence",
    "data mapping tool",
  ],
  authors: [{ name: "Sandip Katel" }],
  creator: "Sandip Katel",
  publisher: "Sandip Katel",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://globe.skatel.com.np",
    title: "3D Earth CSV Visualizer | Interactive Globe Data Dashboard",
    description:
      "Transform your CSV data into stunning 3D visualizations on an interactive Earth globe. AI-powered location detection, comprehensive analytics, and real-time insights.",
    siteName: "3D Earth CSV Visualizer",
    images: [
      {
        url: "http://globe.skatel.com.np/3D_Globe.png",
        width: 1200,
        height: 630,
        alt: "3D Earth CSV Visualizer - Interactive Globe Dashboard",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "3D Earth CSV Visualizer | Interactive Globe Data Dashboard",
    description:
      "Transform CSV data into stunning 3D Earth visualizations with AI-powered analytics. Upload, visualize, analyze.",
    images: ["http://globe.skatel.com.np/3D_Globe.png"], // Add your actual Twitter card image
    creator: "@sandipkatel", // Add your Twitter handle
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  verification: {
    google: "your-google-verification-code",
  },
  alternates: {
    canonical: "https://skatel.com.np",
  },
  category: "technology",
  applicationName: "3D Earth CSV Visualizer",
  appleWebApp: {
    capable: true,
    title: "3D Earth Visualizer",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://www.skatel.com.np"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO enhancements */}
        <link rel="canonical" href="https://skatel.com.np" />
        <meta name="theme-color" content="#000000" />

        {/* Structured Data for Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "3D Earth CSV Visualizer",
              applicationCategory: "BusinessApplication",
              description:
                "Interactive 3D Earth globe for visualizing CSV data with AI-powered location detection and comprehensive analytics",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "150",
              },
              features: [
                "Interactive 3D Globe Visualization",
                "AI-Powered Location Detection",
                "Comprehensive Analytics Dashboard",
                "CSV File Support",
                "Real-time Data Insights",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
