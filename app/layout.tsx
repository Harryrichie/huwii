import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
 title: 'HUWII',
  description: 'Generate SEO-optimized blogs, social media posts, and marketing emails instantly with HUWII. The ultimate AI toolkit for copywriting and SEO analysis.',
  icons: {
    icon: '/favicon.ico', // Path to the file in the public directory
    // Optional: add specific sizes or apple-touch-icons
    apple: '/apple-touch-icon.png', // Path to the file in the public directory
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
