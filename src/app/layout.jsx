import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "PGPlug - Premium Hostel & PG Booking",
  description: "Discover premium hostels and PGs at unbeatable prices. Book your comfortable stay with verified properties and instant confirmation.",
  keywords: "hostel booking, PG booking, student accommodation, verified properties, instant booking",
  authors: [{ name: "PGPlug Team" }],
  icons: {
    icon: '/logo.png',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${poppins.variable} font-sans antialiased bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
