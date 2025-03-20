import Sidebar from "@/components/Sidebar"; // Import Sidebar component
import type { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "User",
  description: "User page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <div className="flex">
        {/* Sidebar for large screens */}
        <div className="lg:block hidden">
          <Sidebar />
        </div>

        {/* Main content */}
        <main className="flex-1 container mx-auto mt-10 p-4">{children}</main>
      </div>
    </React.Fragment>
  );
}
