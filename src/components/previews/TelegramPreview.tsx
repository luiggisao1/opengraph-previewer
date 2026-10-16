import type { OgData } from "@/types/og";

export function TelegramPreview({ data }: { data: OgData }) {
  const domain = data.url
    ? new URL(data.url.startsWith("http") ? data.url : `https://${data.url}`).hostname
    : "example.com";

  return (
    <div className="max-w-[480px] font-sans" style={{ background: "#e6ebee" }}>
      <div className="px-3 py-2">
        {/* Message bubble */}
        <div className="rounded-xl overflow-hidden" style={{ background: "#ffffff", maxWidth: 400 }}>
          {/* Link preview card with left blue border */}
          <div
            className="flex"
            style={{ borderLeft: "3px solid #168acd" }}
          >
            <div className="flex-1 min-w-0 px-3 py-2 space-y-0.5">
              {/* Site name */}
              <p className="text-[13px] font-medium truncate" style={{ color: "#168acd" }}>
                {data.siteName || domain}
              </p>
              {/* Title */}
              <p
                className="text-[14px] font-semibold leading-snug line-clamp-2"
                style={{ color: "#000000" }}
              >
                {data.title || "Page Title"}
              </p>
              {/* Description */}
              {data.description && (
                <p
                  className="text-[13px] leading-relaxed line-clamp-3"
                  style={{ color: "#000000" }}
                >
                  {data.description}
                </p>
              )}
            </div>
          </div>
          {/* Image below text */}
          {data.image && (
            <div style={{ maxHeight: 220, overflow: "hidden" }}>
              <img
                src={data.image}
                alt=""
                className="w-full object-cover"
                style={{ maxHeight: 220 }}
              />
            </div>
          )}
          {/* Timestamp */}
          <div className="px-3 py-1.5 flex justify-end">
            <span className="text-[11px]" style={{ color: "#8e9ba7" }}>
              12:00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
