"use client";

import { ClerkProvider } from "@clerk/nextjs";

console.log("Client layout initializing");
console.log(
  "Clerk key available:",
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log("Client layout rendering");

  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    console.error("Missing Clerk publishable key!");
    return <div>Configuration Error</div>;
  }

  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <main>{children}</main>
    </ClerkProvider>
  );
}
