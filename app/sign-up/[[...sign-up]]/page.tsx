"use client";

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      suppressHydrationWarning
    >
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-slate-800 hover:bg-slate-900",
            card: "shadow-xl",
          },
        }}
        afterSignUpUrl="/dashboard"
        afterSignUp={async (user) => {
          try {
            const response = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/user`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  uuid: user.createdUserId,
                  name: `${user.firstName} ${user.lastName}`.trim(),
                  email: user.emailAddress,
                }),
              }
            );

            if (!response.ok) {
              console.error("Failed to create user in backend");
            }
          } catch (error) {
            console.error("Error creating user:", error);
          }
        }}
      />
    </div>
  );
}
