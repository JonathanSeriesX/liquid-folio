"use client"; // error boundaries must be Client Components

/* Last-resort boundary: replaces the root layout entirely, so nothing from
   globals.css or next-themes can be assumed here — it styles itself inline
   and follows the OS colour scheme. Colours mirror --paper/--ink. */
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.75rem",
          textAlign: "center",
          padding: "1.5rem",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          background: "light-dark(#f7f4ef, #131110)",
          color: "light-dark(#1c1917, #e7e5e4)",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 500, margin: 0 }}>
          Something went badly sideways.
        </h1>
        <p style={{ opacity: 0.6, margin: 0 }}>
          The whole page failed to render.
          {error.digest ? ` Digest: ${error.digest}` : ""}
        </p>
        <button
          type="button"
          onClick={() => retry()}
          style={{
            marginTop: "1rem",
            font: "inherit",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "underline",
            color: "inherit",
          }}
        >
          try again
        </button>
      </body>
    </html>
  );
}
