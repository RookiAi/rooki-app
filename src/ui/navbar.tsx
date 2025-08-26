import { signIn, signOut, useSession } from "next-auth/react";
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
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600 mr-2">Rooki</span>
              <span className="text-zinc-500">AI</span>
            </Link>
          </div>

          {/* Navigation Links/Buttons */}
          <div className="flex items-center space-x-4">
            {/* GitHub Icon */}
            {/* <Link 
              href="https://github.com/orgs/RookiAi/repositories" 
              className="text-zinc-700 hover:text-zinc-900"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </Link> */}
            
            {/* {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800"
                >
                  Dashboard
                </Link>
                <Button onClick={() => void signOut()}>Sign out</Button>
              </>
            ) : (
              <Button onClick={() => void signIn("twitter")}>Log in</Button>
            )} */}

            <Button disabled>Dashboard (soon)</Button>
          </div>
        </div>
      </div>
    </header>
  );
}
