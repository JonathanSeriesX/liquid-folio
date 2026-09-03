/* ===========================================================================
   Liquid Folio — every word, link and number on the site lives in this file.
   Nothing below is layout: swap the values, keep the shapes, and the design
   follows. The components in app/ read from here and never hardcode content.

   Fields that pair with something outside this file are flagged in comments —
   themeColor, for one, mirrors --paper in app/globals.css.
   =========================================================================== */

import type { ReactNode } from "react";
import { Montserrat } from "next/font/google";
// import localFont from "next/font/local";

import { CareerTab } from "@/app/career-tab";
import { HomeTab } from "@/app/home-tab";
import {
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
  // XIcon,
  // YouTubeIcon,
} from "@/app/icons";
import { ProjectsTab } from "@/app/projects-tab";
import { countCsvRows, githubStars } from "@/app/stats";

/* --- typeface -------------------------------------------------------------
   The whole site refers to --font-body and nothing else, so this is the only
   place a face is chosen. Exactly one `bodyFont` export must be live; comment
   the other out, imports included, so next/font doesn't fetch a face nobody
   uses.

   Montserrat ships by default: next/font/google self-hosts it at build time
   (no runtime request to Google) and the OFL lets anyone redistribute it,
   which a public repo needs. Any other Google face is a one-word change.

   To use your own instead, drop a variable .woff2 into public/fonts and swap
   the two blocks:

     import localFont from "next/font/local";

     export const bodyFont = localFont({
       src: "./public/fonts/YourFace.woff2",
       variable: "--font-body",
       display: "swap",
       weight: "100 800",
     });

   Mind the licence — most retail webfonts may not be committed to a public
   repo. Keep those in a private fork, or load them from a CDN you pay for. */
export const bodyFont = Montserrat({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/** Optional credit rendered between the footer's two pill clusters — some
    retail font licences require attribution, and this is where it goes.
    Montserrat's OFL doesn't, so none is shown:

      export const fontCredit: FontCredit | null = {
        name: "Suisse Intl",
        href: "https://www.swisstypefaces.com/fonts/suisse/",
        designer: "Swiss Typefaces",
        designerHref: "https://www.swisstypefaces.com/",
      };
*/
export const fontCredit: FontCredit | null = null;

/* --- shapes ---------------------------------------------------------------
   `accent` is a class from globals.css; leaving it off gives the site accent
   (crimson). To add your own: extend the union below with "accent-<name>",
   then declare --c-<name> and .accent-<name> in globals.css alongside the
   others — the components derive everything else from the name. */
export type Accent =
  "accent-azure" | "accent-amber" | "accent-violet" | "accent-emerald";

export type ProjectIcon = { src: string } | { emoji: string };

export interface FontCredit {
  /** the typeface */
  name: string;
  href?: string;
  /** who drew it — omit to credit the face alone */
  designer?: string;
  designerHref?: string;
}

export interface Social {
  label: string;
  href: string;
  Icon: () => ReactNode;
}

export interface Tab {
  /** doubles as the URL segment — /<id> — so keep it unique and URL-safe;
      the first tab is served at / and its /<id> form redirects there */
  id: string;
  label: string;
  /** the panel this tab shows — any component from app/, async is fine */
  Panel: () => ReactNode;
}

export interface Interest {
  label: string;
  /** swapped in on hover, for a private joke or two */
  hover?: string;
}

export interface Project {
  name: string;
  href: string;
  icon: ProjectIcon;
  year: string;
  accent?: Accent;
  /** Write these the way the technology writes itself — "ArgoCD", "Next.js",
      "local LLMs". They render lowercase and reveal their real casing on
      hover, so the styling is the stylesheet's job, not yours. */
  pills: string[];
  bio: string;
  /** live figures for the stat strip — see app/stats.ts for the helpers */
  stats?: () => Promise<ReactNode>;
}

export interface ReservedProject {
  name: string;
  icon: ProjectIcon;
  accent?: Accent;
  /** defaults to "soon" */
  year?: string;
  bio: string;
}

export interface ExperienceEntry {
  years: string;
  name: string;
  meta: string;
  accent?: Accent;
  /** pulses the timeline dot — for the role you are in right now */
  live?: boolean;
  bio: string;
  /** properly cased — see Project.pills */
  pills?: string[];
}

/** `{ gap: true }` renders a dashed stretch of the timeline: CV silence,
    made explicit rather than papered over. */
export type ExperienceRow = ExperienceEntry | { gap: true };

/* The three panels. Annotating each section (rather than letting TypeScript
   infer it) is what makes an editor autocomplete the fields below and flag a
   typo'd accent as you type. */
export interface SiteConfig {
  /** shown at the top left, and used as the OG site name */
  wordmark: string;
  /** your name as search engines should know it — feeds the JSON-LD Person */
  name: string;
  title: string;
  description: string;
  url: string;
  lang: string;
  locale: string;
  /** null ships no share image; drop a 1200×630 file in public/ to add one */
  ogImage: { src: string; width: number; height: number; alt: string } | null;
  twitter: { card: "summary" | "summary_large_image"; creator?: string };
  themeColor: { light: string; dark: string };
  analytics: { cloudflareBeaconToken?: string };
}

export interface HomeContent {
  /** null drops the portrait and lets the hero run full width */
  photo: { src: string; alt: string } | null;
  headline: ReactNode;
  cycleWords: string[];
  cycleLabel: string;
  blurb: ReactNode;
  interestsIntro: ReactNode;
  interests: Interest[];
}

export interface ProjectsContent {
  intro: ReactNode;
  entries: Project[];
  reserved: ReservedProject[];
}

export interface CareerContent {
  intro: ReactNode;
  entries: ExperienceRow[];
}

/* --- site ---------------------------------------------------------------- */

export const site: SiteConfig = {
  /** shown at the top left, and used as the OG site name */
  wordmark: "me_irl",
  name: "Evgenii Ostrovskii",
  title: "me_irl",
  description: "Evgenii Ostrovskii's personal page",
  url: "https://evgenii.org",
  lang: "en",
  locale: "en_GB",

  ogImage: {
    src: "/me.jpg",
    width: 800,
    height: 800,
    alt: "Evgenii Ostrovskii",
  },

  /* `summary` (not `summary_large_image`) keeps the photo as a small square
     thumbnail beside the text */
  twitter: {
    card: "summary" as const,
    creator: "@JonathanSeriesX",
  },

  /** browser chrome colour — keep in step with --paper in app/globals.css */
  themeColor: {
    light: "#f7f4ef",
    dark: "#131110",
  },

  analytics: {
    /** Cloudflare Web Analytics. Unset → no beacon is rendered at all.
        Set NEXT_PUBLIC_CF_BEACON_TOKEN in .env.local (see .env.example). */
    cloudflareBeaconToken: process.env.NEXT_PUBLIC_CF_BEACON_TOKEN,
  },
};

export const socials: Social[] = [
  {
    label: "GitHub",
    href: "https://github.com/JonathanSeriesX",
    Icon: GitHubIcon,
  },
  // { label: "X", href: "https://twitter.com/JonathanSeriesX", Icon: XIcon },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/jonathanseriesx",
    Icon: LinkedInIcon,
  },
  // {
  //   label: "YouTube",
  //   href: "https://www.youtube.com/@intensifiedhipster",
  //   Icon: YouTubeIcon,
  // },
  { label: "Email", href: "mailto:me@evgenii.org", Icon: MailIcon },
];

/* --- tabs ---------------------------------------------------------------
   Two to six. The picker folds onto two rows on narrow viewports once there
   are four or more (4 → 2+2, 5 → 3+2, 6 → 3+3), so long labels stay legible.
   Each tab carries its own panel component, so adding a tab is one entry
   here plus one component file — app/(tabs)/ renders whatever this list
   says, in this order, and gives every tab its own URL: the first at /, the
   rest at /<id>. The sitemap follows suit. */
export const tabs: Tab[] = [
  { id: "home", label: "home", Panel: HomeTab },
  { id: "projects", label: "projects", Panel: ProjectsTab },
  { id: "career", label: "career", Panel: CareerTab },
];

/** A tab's path: the first tab is the site root, every other one is /<id>. */
export const tabHref = (id: string) => (id === tabs[0].id ? "/" : `/${id}`);

/* --- home ---------------------------------------------------------------- */

export const home: HomeContent = {
  photo: { src: "/me.jpg", alt: "Evgenii" },

  /* the line before the rolling words; the roll is appended inline */
  headline: (
    <>
      Hi there, my name is Evgenii.
      <br />I build stuff for{" "}
    </>
  ),

  /* Ordered for a single pass: opens on the specific ("international banks."),
     rolls through the rest, and parks on the umbrella phrase. Any length works
     — the keyframes are generated from this list. */
  cycleWords: [
    "banks.",
    "trading floors.",
    "Apple collectors.",
    "Day One users.",
    "people.",
  ],
  /** what a screen reader hears in place of the roll */
  cycleLabel: "all sorts of people.",

  blurb: (
    <>
      By day, I&apos;m a DevOps engineer keeping{" "}
      <span className="mono">&lt;something_secret&gt;</span> observable,
      automated, and exceeding SLOs.
    </>
  ),

  interestsIntro: "By evening, I'm into:",
  interests: [
    { label: "home lab" },
    { label: "computer hardware" },
    { label: "digital photography" },
    { label: "formula 1", hover: "#CL16" },
    { label: "competitive tetris" },
    { label: "indie games" },
    { label: "micro-mobility" },
    { label: "urbanism" },
    { label: "right to repair" },
    { label: "drum & bass" },
  ],
};

/* --- projects ------------------------------------------------------------ */

const everycaseDb =
  "https://raw.githubusercontent.com/JonathanSeriesX/everycase/HEAD/database";

export const projects: ProjectsContent = {
  intro: (
    <>
      By night, I&apos;m fixing small gaps in this world one by one, and
      probably with more care than they deserve.
    </>
  ),

  /* newest first */
  entries: [
    {
      name: "Twixodus",
      href: "https://twixodus.evgenii.org",
      icon: { emoji: "🕊️" },
      year: "2025 — today",
      accent: "accent-azure",
      pills: ["Swift", "local LLMs"],
      bio: "A Swift app that migrates your Twitter archive into Day One journal, and does it really well.",
      stats: async () => {
        const stars = await githubStars("JonathanSeriesX/dayoneXtwitter");
        return (
          <>
            <span className="star" aria-hidden>
              ★
            </span>{" "}
            {stars ?? 19} on github · thousands of tweets imported
          </>
        );
      },
    },
    {
      name: "Finest Woven",
      href: "https://everycase.org",
      icon: { src: "/icons/everycase.png" },
      year: "2023 — today",
      pills: ["Next.js", "MongoDB", "data scraping"],
      bio: "The one and only database of accessories made by Apple. Ultra-fast and non-intrusive, as every website should be.",
      /* straight from everycase's public CSVs; the fallbacks are the figures
         counted by hand on 2026-08-14 */
      stats: async () => {
        const [cases, devices] = await Promise.all([
          countCsvRows(`${everycaseDb}/database.csv`),
          countCsvRows(`${everycaseDb}/devices.csv`),
        ]);
        return `${(cases ?? 1331).toLocaleString("en-GB")} cases · ${devices ?? 345} devices · $0/mo to run`;
      },
    },
  ],

  /* placeholders for things that exist but have nowhere to live yet */
  reserved: [
    {
      name: "Photography",
      icon: { emoji: "📷" },
      accent: "accent-amber",
      bio: "I figured out a lovely way to process images from my mirrorless, but I've yet to figure out a nice way to publish them :/",
    },
    {
      name: "DJing",
      icon: { emoji: "🎧" },
      accent: "accent-violet",
      bio: "Mixes will land somewhere once my drum & bass folder stops being on fire.",
    },
  ],
};

/* --- career -------------------------------------------------------------- */

export const career: CareerContent = {
  intro: "currently in Lisbon • open to relocation",

  /* newest first; each row hands its colour to the next as the timeline's
     lane gradient, so reordering recolours the lane automatically */
  entries: [
    {
      years: "nowadays",
      name: "Something special",
      meta: "under NDA",
      live: true,
      bio: "¯\\_(ツ)_/¯",
      pills: ["Grafana", "ArgoCD"],
    },
    {
      years: "2024–25",
      name: "BNP Paribas",
      meta: "SRE · Porto",
      accent: "accent-emerald",
      bio: "Improved monitoring, automated stuff.",
      pills: ["Kubernetes", "AWS", "Grafana", "Ansible"],
    },
    {
      years: "2022–24",
      name: "Libertex Group",
      meta: "SRE · Podgorica",
      accent: "accent-azure",
      bio: "Kept live trading systems running.",
      pills: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
    },
    { gap: true },
    {
      years: "2016–20",
      name: "BSc in Information Security",
      meta: "Saint Petersburg",
      accent: "accent-violet",
      bio: "Studied programming, cryptography, signal processing, and much more.",
      //pills: ["cryptography", "PKI", "x86 asm"],
    },
  ],
};
