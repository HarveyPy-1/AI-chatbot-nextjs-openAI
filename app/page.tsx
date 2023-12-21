import Image from "next/image";
import logo from "@/public/assets/images/logo.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Home() {
  // Check if userId exists
  const { userId } = auth();

  // If userId, client is already logged in, redirect
  if (userId) redirect("/notes");

  return (
    <main className="flex h-screen flex-col items-center justify-center gap-5">
      <div className="flex items-center gap-4">
        <Image src={logo} alt="logo" width={100} height={100} />
        <span className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          AI Notes
        </span>
      </div>
      <p className="max-w-prose text-center">
        A sophisticated note-taking application seamlessly incorporating AI,
        developed using OpenAI, Pinecone, NextJS, Shadcn UI, Clerk, and other
        cutting-edge technologies.
      </p>
      {/* Instead of wrapping this button with a Link tag, use the asChild prop to tell it to render as a Link tag */}
      <Button size="lg" asChild>
        <Link href="/notes">Open</Link>
      </Button>
    </main>
  );
}
