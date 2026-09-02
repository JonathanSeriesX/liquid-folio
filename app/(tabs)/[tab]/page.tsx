import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";

import { site, tabHref, tabs } from "@/site.config";

type Props = { params: Promise<{ tab: string }> };

/* Every tab is prerendered from the config and anything else is a 404, so a
   mistyped URL never renders an empty shell. */
export const dynamicParams = false;

export function generateStaticParams() {
  return tabs.map(({ id }) => ({ tab: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tab } = await params;
  const entry = tabs.find(({ id }) => id === tab);
  if (!entry) return {};
  return {
    title: `${entry.label} · ${site.wordmark}`,
    alternates: { canonical: tabHref(entry.id) },
  };
}

export default async function TabPage({ params }: Props) {
  const { tab } = await params;
  const entry = tabs.find(({ id }) => id === tab);
  if (!entry) notFound();
  // the first tab is served at the site root — its /<id> form redirects there
  if (tabHref(entry.id) === "/") permanentRedirect("/");
  return <entry.Panel />;
}
