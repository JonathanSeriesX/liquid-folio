import { getImageProps } from "next/image";
import { preload } from "react-dom";

import { home, projects } from "@/site.config";

import { PHOTO_SIZES } from "./home-tab";
import { ICON_SIZES } from "./projects-tab";

/* Every raster any panel shows, preloaded from the root layout.

   Panels are routes, so a tab switch mounts a fresh panel and its <Image>s
   start from nothing; without this the projects icon would visibly pop in
   on each visit while it is fetched. Preloading from the layout means the
   browser already has every image by the time any panel asks — and because
   the sources are static imports (immutable, content-hashed URLs) it keeps
   them, so the fetch happens once per session, not once per panel.

   getImageProps yields exactly the srcset/sizes the matching <Image> will
   render (same src, same fill + sizes), so the browser resolves the preload
   and the later <img> to the same URL and the cache hit is guaranteed.

   ReactDOM.preload rather than a hand-written <link>: React keys these hints
   by URL and dedupes them, so if a panel's <Image> asks for its own preload
   (next/image does, for eager images) the document still carries one hint
   per image, not two. A bare <link imagesrcset> has no href to key on and
   neither dedupes nor gets hoisted into <head>.

   The list is built inside the component, not at module scope: site.config
   imports the tab components and this file imports site.config, so reading
   `home` during module evaluation could run before the config exists. */
export function PreloadImages() {
  const images = [
    ...(home.photo
      ? [
          {
            src: home.photo.src,
            sizes: PHOTO_SIZES,
            fetchPriority: "high" as const,
          },
        ]
      : []),
    ...[...projects.entries, ...projects.reserved].flatMap(({ icon }) =>
      "src" in icon
        ? [{ src: icon.src, sizes: ICON_SIZES, fetchPriority: "auto" as const }]
        : [],
    ),
  ];
  for (const { src, sizes, fetchPriority } of images) {
    const { props } = getImageProps({ src, alt: "", fill: true, sizes });
    preload(props.src, {
      as: "image",
      imageSrcSet: props.srcSet,
      imageSizes: props.sizes,
      fetchPriority,
    });
  }
  return null;
}
