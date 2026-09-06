"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/* Refractive glass, ported from github.com/shuding/liquid-glass.

   The trick: `backdrop-filter: url(#filter)` where the SVG filter is an
   feDisplacementMap fed by a per-element displacement map. The map is a
   rounded-rect signed-distance field drawn on a canvas — flat in the middle,
   pulling the backdrop inward along the rim — so every glass surface gets a
   lens edge that bends whatever sits behind it.

   Only Chromium accepts url() inside backdrop-filter. Elsewhere the support
   check fails, nothing is touched, and globals.css's plain blur stays. */

const GLASS =
  ".site-header, .tab-bar, .tab-panel, .xp-box, .photo-shell, .project-card, .seg";
// ponytail: half-res maps stretched by feImage; go 1 if rims look stepped
const RES = 0.5;
const STRENGTH = 0.35; // how hard the rim pulls the backdrop inward, 0–1
// shuding adds contrast(1.2) brightness(1.05) too; on pale paper they clip to white
const CHAIN = "blur(0.25px) saturate(1.1)";
const NS = "http://www.w3.org/2000/svg";

function smoothStep(a: number, b: number, t: number) {
  t = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function roundedRectSDF(
  x: number,
  y: number,
  hw: number,
  hh: number,
  r: number,
) {
  const qx = Math.abs(x) - hw + r;
  const qy = Math.abs(y) - hh + r;
  return (
    Math.min(Math.max(qx, qy), 0) +
    Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) -
    r
  );
}

/* displacement map for a w×h box: R/G encode the x/y sample offset in CSS
   px, centred on 0.5, so feDisplacementMap's `scale` is the largest offset */
function buildMap(w: number, h: number, radius: number) {
  const cw = Math.max(1, Math.round(w * RES));
  const ch = Math.max(1, Math.round(h * RES));
  const r = Math.min(radius, w / 2, h / 2);
  const band = Math.min(Math.max(Math.min(w, h) * 0.4, 10), 48);
  const dx = new Float32Array(cw * ch);
  const dy = new Float32Array(cw * ch);
  let max = 0;
  for (let j = 0; j < ch; j++) {
    for (let i = 0; i < cw; i++) {
      const px = (i + 0.5) / RES - w / 2;
      const py = (j + 0.5) / RES - h / 2;
      const d = roundedRectSDF(px, py, w / 2, h / 2, r);
      const k = smoothStep(-band, 0, d) * STRENGTH;
      const n = j * cw + i;
      dx[n] = -px * k;
      dy[n] = -py * k;
      max = Math.max(max, Math.abs(dx[n]), Math.abs(dy[n]));
    }
  }
  const scale = Math.max(max, 1e-3);
  const data = new Uint8ClampedArray(cw * ch * 4);
  for (let n = 0; n < cw * ch; n++) {
    data[n * 4] = (dx[n] / scale / 2 + 0.5) * 255;
    data[n * 4 + 1] = (dy[n] / scale / 2 + 0.5) * 255;
    data[n * 4 + 3] = 255;
  }
  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  canvas.getContext("2d")!.putImageData(new ImageData(data, cw, ch), 0, 0);
  return { href: canvas.toDataURL(), scale };
}

export function LiquidGlass() {
  const pathname = usePathname();

  useEffect(() => {
    if (!CSS.supports("backdrop-filter", "url(#lg)")) return;

    const root = document.documentElement;
    root.classList.add("liquid");

    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("width", "0");
    svg.setAttribute("height", "0");
    svg.style.position = "absolute";
    const defs = document.createElementNS(NS, "defs");
    svg.append(defs);
    document.body.append(svg);

    let n = 0;
    const filters = new Map<
      Element,
      { filter: SVGFilterElement; image: Element; map: Element }
    >();

    const refresh = (el: HTMLElement) => {
      const { filter, image, map } = filters.get(el)!;
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      if (!w || !h) return;
      const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
      const { href, scale } = buildMap(w, h, radius);
      filter.setAttribute("width", String(w));
      filter.setAttribute("height", String(h));
      image.setAttribute("width", String(w));
      image.setAttribute("height", String(h));
      image.setAttribute("href", href);
      map.setAttribute("scale", scale.toFixed(2));
      const value = `url(#${filter.id}) ${CHAIN}`;
      el.style.setProperty("backdrop-filter", value);
      el.style.setProperty("-webkit-backdrop-filter", value);
    };

    const ro = new ResizeObserver((entries) => {
      for (const { target } of entries) refresh(target as HTMLElement);
    });

    for (const el of document.querySelectorAll<HTMLElement>(GLASS)) {
      const filter = document.createElementNS(NS, "filter");
      filter.id = `lg-${n++}`;
      filter.setAttribute("filterUnits", "userSpaceOnUse");
      filter.setAttribute("color-interpolation-filters", "sRGB");
      filter.setAttribute("x", "0");
      filter.setAttribute("y", "0");
      const image = document.createElementNS(NS, "feImage");
      image.setAttribute("preserveAspectRatio", "none");
      image.setAttribute("result", "map");
      const map = document.createElementNS(NS, "feDisplacementMap");
      map.setAttribute("in", "SourceGraphic");
      map.setAttribute("in2", "map");
      map.setAttribute("xChannelSelector", "R");
      map.setAttribute("yChannelSelector", "G");
      filter.append(image, map);
      defs.append(filter);
      filters.set(el, { filter, image, map });
      ro.observe(el); // fires once on observe, so the first build happens here
    }

    return () => {
      ro.disconnect();
      for (const el of filters.keys()) {
        (el as HTMLElement).style.removeProperty("backdrop-filter");
        (el as HTMLElement).style.removeProperty("-webkit-backdrop-filter");
      }
      svg.remove();
      root.classList.remove("liquid");
    };
  }, [pathname]);

  return null;
}
