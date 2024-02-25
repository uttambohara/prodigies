import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function AgencyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <div>{children}</div>
    </ClerkProvider>
  );
}
