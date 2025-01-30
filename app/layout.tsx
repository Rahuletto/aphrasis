import "./globals.css";
import { metadata } from "./metadata";
import ClientLayout from "./client-layout";

export { metadata };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-display`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
