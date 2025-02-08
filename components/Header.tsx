import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-black">
          Your App
        </Link>

        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <div className="flex gap-4">
              <Link
                href="/sign-in"
                className="text-sm font-medium hover:text-slate-900"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="text-sm font-medium bg-slate-800  px-4 py-2 rounded-lg hover:bg-slate-900"
              >
                Sign up
              </Link>
            </div>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
