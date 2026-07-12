import type { Metadata } from "next";
import { Inter, Inter_Tight } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

/*
 * Design_Guide.md display face is Neue Haas Grotesk Display (proprietary).
 * Its stated open substitute is Inter Display at light weights — Inter Tight
 * is the Google-Fonts display cut of Inter, used here at weight 330.
 */
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tijara — Everyday essentials, considered",
  description:
    "Tijara is a single-vendor commerce studio for apparel, footwear, home and personal care — curated brands, honest prices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
