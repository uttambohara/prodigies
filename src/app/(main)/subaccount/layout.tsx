import { ClerkProvider } from "@clerk/nextjs";
import React from "react";

export default function SubAccountLayout({
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
