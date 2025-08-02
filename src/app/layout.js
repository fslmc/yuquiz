export const metadata = {
  title: "yuQuiz",
  description: "Challenge your friends on the ultimate quiz game platform!",
};

import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/ui/navbar";
import Footer from "@/ui/footer";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],          // specify weights if not using a variable font
  variable: '--font-poppins',     // optional, for CSS variable usage
  display: 'swap',                // recommended for best rendering
})

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>

      </head>
      <body
        className={`${poppins.variable} antialiased`}
      >
      <Navbar />

      {children}

      <Footer />
      </body>
    </html>
  );
}
