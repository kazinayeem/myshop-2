import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "./StoreProvider";

export const metadata: Metadata = {
  title: "My Store",
  description: "A simple store app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased  scroll-smooth`} cz-shortcut-listen="true">
        <StoreProvider>
          <Navbar />
          <main className=" mx-auto  px-4 py-8">{children}</main>
        </StoreProvider>
      </body>
    </html>
  );
}
