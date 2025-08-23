import { signIn, useSession } from "next-auth/react";
import { Link } from "~/components/link";
import { Button } from "~/components/button";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-zinc-950/10 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/App Name */}
          <div className="flex flex-shrink-0 items-center">
            <Link href="/" className="text-xl font-bold text-zinc-950">
              Rooki
            </Link>
          </div>

          {/* Navigation Links/Buttons */}
          <div className="flex items-center space-x-4">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
              >
                Dashboard
              </Link>
            ) : (
              <Button onClick={() => void signIn("twitter")}>Log in</Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
