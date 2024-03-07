"use client";

import Link from "next/link";

import {
  IconGitHub,
  IconSeparator,
  IconSparkles,
  IconVercel,
} from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";

export async function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full px-4 border-b h-14 shrink-0 bg-background backdrop-blur-xl">
      <span className="inline-flex items-center home-links whitespace-nowrap">
        <a href="https://vercel.com" rel="noopener" target="_blank">
          <IconVercel className="w-5 h-5 sm:h-6 sm:w-6" />
        </a>
        <IconSeparator className="w-6 h-6 text-muted-foreground/20" />
        <Link href="/" className="mr-10">
          <span className="text-lg font-bold">
            <IconSparkles className="inline mr-0 w-4 sm:w-5 mb-0.5" />
            AI
          </span>
        </Link>
        <p className="bg-blue-600 text-white text-sm bold rounded px-2 py-1">
          Call actions with
          <ArrowRight className="ml-2 h-4 w-4 inline-block" />
        </p>
        <Tabs defaultValue={pathname} className="ml-4">
          <TabsList>
            <TabsTrigger value={"/"} asChild>
              <Link href={"/"}>createStreamableUI</Link>
            </TabsTrigger>
            <TabsTrigger value={"/rendered"} asChild>
              <Link href={"/rendered"}>render</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </span>
      <div className="flex items-center justify-end space-x-2">
        <Button variant="outline" asChild>
          <a
            target="_blank"
            href="https://github.com/vercel/ai/tree/main/examples/next-ai-rsc"
            rel="noopener noreferrer"
          >
            <IconGitHub />
            <span className="hidden ml-2 md:flex">GitHub</span>
          </a>
        </Button>
        <Button asChild>
          <a
            href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai%2Fblob%2Fmain%2Fexamples%2Fnext-ai-rsc&env=OPENAI_API_KEY&envDescription=OpenAI+API+Key&envLink=https%3A%2F%2Fplatform.openai.com%2Fapi-keys"
            target="_blank"
          >
            <IconVercel className="mr-2" />
            <span className="hidden sm:block">Deploy to Vercel</span>
            <span className="sm:hidden">Deploy</span>
          </a>
        </Button>
      </div>
    </header>
  );
}
