import type { CSSProperties } from "react";

import type { Glow, GlowColor, Scene } from "@/site.config";

/* The ambient backdrop is three lights and an optional wash, positioned per
   tab in site.config (Tab.scene). This file turns a Scene into the custom
   properties globals.css reads — --g1-x, --g1-c and friends — which are
   registered with @property there, so when a navigation swaps one scene's
   values for another's the browser tweens every centre, radius and colour
   instead of snapping. Type-only import from site.config: this module is
   shared by client components (tab-shell, error) that must not pull the
   config itself into their bundle. */

/** the look the site shipped with — crimson corners, an amber top right.
    Any tab without a scene of its own, and every page outside the tabs
    (404, error), gets this. */
export const fallbackScene: Scene = {
  glows: [
    { color: "crimson", x: 15, y: 2, w: 50, h: 40 },
    { color: "amber", x: 85, y: 6, w: 42, h: 34, strength: 1.4 },
    { color: "crimson", x: 75, y: 96, w: 45, h: 38 },
  ],
};

/* a named colour reads the theme-aware glow palette (--gl-*), a hex is
   used as-is in every theme */
const glowColor = (color: GlowColor) =>
  color.startsWith("#") ? color : `var(--gl-${color})`;

const glowVars = (n: number, g: Glow) => ({
  [`--g${n}-c`]: glowColor(g.color),
  [`--g${n}-x`]: `${g.x}%`,
  [`--g${n}-y`]: `${g.y}%`,
  [`--g${n}-w`]: `${g.w ?? 45}%`,
  [`--g${n}-h`]: `${g.h ?? 38}%`,
  [`--g${n}-a`]: String(g.strength ?? 1),
});

/** inline style carrying one scene; put it on any ancestor of .ambient */
export function sceneStyle(scene: Scene = fallbackScene): CSSProperties {
  const [a, b, c] = scene.glows;
  return {
    ...glowVars(1, a),
    ...glowVars(2, b),
    ...glowVars(3, c),
    "--wash-c": scene.wash ? glowColor(scene.wash) : "transparent",
  } as CSSProperties;
}
