import "./globals.css";

export const metadata = {
  title: "DryGuard",
  description: "Smart drying cover demo",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}