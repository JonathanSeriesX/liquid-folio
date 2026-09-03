import type { Ref } from "react";

import type { Scene } from "@/site.config";

import { sceneStyle } from "./scene";

/* The ambient backdrop: three soft lights and a wash, fixed behind the page.
   Which colours sit where comes from the --g*-/--wash-c custom properties
   (see scene.ts); inside the tab shell those live on the shell so the thumb
   can share them, so the backdrop is rendered bare and inherits. Pages
   outside the shell (404, error) pass a scene and it styles itself.

   Two layers on purpose: the outer one takes the one-shot navigation swing
   (tab-shell.tsx, Web Animations API), the inner one the endless CSS drift —
   both animate transform, and on one element the later would cancel the
   earlier. */
export function Ambient({
  scene,
  ref,
}: {
  scene?: Scene;
  ref?: Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={ref}
      className="ambient"
      aria-hidden
      style={scene ? sceneStyle(scene) : undefined}
    >
      <div className="ambient-glow" />
    </div>
  );
}
