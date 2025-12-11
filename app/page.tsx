import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-center py-32 px-16 bg-white dark:bg-black">
        <div className="flex flex-col items-center gap-6 text-center">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Basic Auth with Firebase
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            A Next.js application with Firebase Authentication, featuring login/registration forms with server actions and route protection.
          </p>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <Button asChild>
              <Link href={ROUTES.LOGIN}>Login</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={ROUTES.REGISTER}>Register</Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
