import type { Metadata } from "next";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
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
    // <React.Fragment>
    //   <div className="flex">
    //     {/* Sidebar for large screens */}
    //     {/* <div className="lg:block hidden">
    //       <Sidebar />
    //     </div> */}

    //     {/* Main content */}
    //     <main className="flex-1 container mx-auto mt-10 p-4">{children}</main>
    //   </div>
    // </React.Fragment>
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
