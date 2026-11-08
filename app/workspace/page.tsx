"use client";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Workspace } from "@/components/workspace/Workspace";

export default function WorkspacePage() {
  return (
    <>
      <SiteHeader />
      <main className="container flex-1 py-8 sm:py-10">
        <Workspace />
      </main>
      <SiteFooter />
    </>
  );
}
