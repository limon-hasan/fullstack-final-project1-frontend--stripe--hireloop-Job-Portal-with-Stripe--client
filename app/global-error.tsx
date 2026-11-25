"use client"

import { RefreshCw } from "lucide-react"

export default function GlobalError({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred."

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#08080a",
          color: "#f4f4f5",
          fontFamily: "system-ui, sans-serif",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 460, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 600 }}>
            HireLoop needs a refresh
          </h1>
          <p style={{ marginTop: 10, fontSize: 14, color: "#a1a1aa" }}>
            {message}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              marginTop: 24,
              height: 44,
              padding: "0 22px",
              borderRadius: 12,
              border: "none",
              background: "#5b4df5",
              color: "white",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <RefreshCw size={16} style={{ marginRight: 8 }} />
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
