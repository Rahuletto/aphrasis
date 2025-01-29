"use client";

import { SignIn, useSession } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignInPage() {
  const { session } = useSession();

  useEffect(() => {
    if (session) {
      const { id, user } = session;
      const updateUser = async () => {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/user`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uuid: id,
                name: `${user.firstName} ${user.lastName}`.trim(),
                email: user.emailAddresses[0]?.emailAddress,
              }),
            }
          );
          if (!response.ok) console.error("Failed to update user in backend");
        } catch (error) {
          console.error("Error updating user:", error);
        }
      };

      updateUser();
    }
  }, [session]);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-white"
      suppressHydrationWarning
    >
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-slate-800 hover:bg-slate-900",
            card: "shadow-xl",
          },
        }}
        afterSignInUrl="/dashboard"
      />
    </div>
  );
}
