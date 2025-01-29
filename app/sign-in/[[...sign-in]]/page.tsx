"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      suppressHydrationWarning
    >
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-slate-800 hover:bg-slate-900",
            card: "shadow-xl",
          },
        }}
      />
    </div>
  );
}
