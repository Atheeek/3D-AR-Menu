import type { Metadata } from "next";
// Optional: Import your chosen font if configured
// import { Inter } from "next/font/google";
import "./globals.css"; // Ensure Tailwind directives are here

// Optional Font setup
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AR Menu Platform", // Or your preferred title
  description: "View restaurant menus in Augmented Reality", // Or your preferred description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Apply font className if using one, along with theme classes */}
      {/* Example: className={inter.className + ' bg-brand-dark text-brand-text'} */}
      <body className={'bg-brand-dark text-brand-text'}> {/* Apply base theme */}

        {/* This renders the actual page content (like your LandingPage or MenuPage) */}
        {children}

        {/* Keep the <model-viewer> script essential for AR */}
        <script
          type="module"
          src="https://ajax.googleapis.com/ajax/libs/model-viewer/3.4.0/model-viewer.min.js"
          async
        ></script>
      </body>
    </html>
  );
}