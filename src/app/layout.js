export const metadata = {
  title: "yuQuiz",
  description: "Challenge your friends on the ultimate quiz game platform!",
};

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/ui/navbar";
import Footer from "@/ui/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Navbar />

      {children}

      <Footer />
      </body>
    </html>
  );
}
