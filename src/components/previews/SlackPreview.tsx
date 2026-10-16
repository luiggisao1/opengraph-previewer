import type { OgData } from "@/types/og";

export function SlackPreview({ data }: { data: OgData }) {
  const domain = data.url
    ? new URL(data.url.startsWith("http") ? data.url : `https://${data.url}`).hostname
    : "example.com";

  return (
    <div className="max-w-[560px] font-sans" style={{ background: "#ffffff" }}>
      {/* Message area */}
      <div className="flex gap-2 px-4 py-2">
        {/* Avatar */}
        <div
          className="w-9 h-9 rounded-md flex items-center justify-center text-sm font-bold shrink-0"
          style={{ background: "#4A154B", color: "#ffffff" }}
        >
          B
        </div>
        <div className="min-w-0 flex-1">
          {/* Username + timestamp */}
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-bold" style={{ color: "#1d1c1d" }}>
              Bot
            </span>
            <span className="text-xs" style={{ color: "#616061" }}>
              12:00 PM
            </span>
          </div>
          {/* Message text (the URL) */}
          <p className="text-[15px] mt-0.5" style={{ color: "#1264A3" }}>
            {data.url || "https://example.com"}
          </p>

          {/* Unfurled link preview */}
          <div
            className="mt-1.5 rounded-lg overflow-hidden"
            style={{
              border: "1px solid #e8e8e8",
              borderLeft: "4px solid #e8e8e8",
              background: "#ffffff",
              maxWidth: 520,
            }}
          >
            <div className="px-3 py-2 space-y-1">
              {/* Site name / favicon row */}
              <div className="flex items-center gap-1.5">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`}
                  alt=""
                  className="w-4 h-4 rounded-sm"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                  }}
                />
                <span className="text-xs font-bold" style={{ color: "#1d1c1d" }}>
                  {data.siteName || domain}
                </span>
              </div>
              {/* Title */}
              <p
                className="text-[15px] font-bold leading-snug line-clamp-2"
                style={{ color: "#1264A3" }}
              >
                {data.title || "Page Title"}
              </p>
              {/* Description */}
              {(data.description) && (
                <p
                  className="text-[13px] leading-relaxed line-clamp-3"
                  style={{ color: "#1d1c1d" }}
                >
                  {data.description}
                </p>
              )}
            </div>
            {/* Image */}
            {data.image && (
              <div style={{ maxHeight: 250, overflow: "hidden" }}>
                <img
                  src={data.image}
                  alt=""
                  className="w-full object-cover"
                  style={{ maxHeight: 250 }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
