import { Github } from "lucide-react";
import NextLink from "next/link";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">Auth Kit Demo</h1>
        <p className="text-lg text-gray-600 max-w-md">
          This is a demo application showcasing all the components in a
          traditional OAuth next.js app
        </p>
        <Button asChild className="px-6 py-2 text-lg">
          <NextLink href="/api/auth/github/signin">
            <Github className="mr-2 h-5 w-5" />
            Sign In with GitHub
          </NextLink>
        </Button>
      </div>
    </main>
  );
}
