import type { OgData } from "@/types/og";

export function TwitterPreview({ data }: { data: OgData }) {
  const domain = data.url ? new URL(data.url.startsWith("http") ? data.url : `https://${data.url}`).hostname : "example.com";
  const title = data.twitterTitle || data.title;
  const description = data.twitterDescription || data.description;
  const image = data.twitterImage || data.image;
  const card = data.twitterCard || "summary_large_image";

  if (card === "summary") {
    return (
      <div className="max-w-[504px] rounded-2xl overflow-hidden shadow-sm flex" style={{ border: "1px solid #cfd9de", background: "#ffffff" }}>
        <div className="w-[130px] h-[130px] shrink-0 overflow-hidden" style={{ background: "#eff3f4" }}>
          {image ? (
            <img src={image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xs" style={{ color: "#536471" }}>
              No image
            </div>
          )}
        </div>
        <div className="px-3 py-2.5 space-y-0.5 min-w-0">
          <p className="text-xs" style={{ color: "#536471" }}>{domain}</p>
          <p className="text-sm font-semibold leading-tight line-clamp-2" style={{ color: "#0f1419" }}>
            {title || "Page Title"}
          </p>
          <p className="text-xs line-clamp-2" style={{ color: "#536471" }}>
            {description || "Description"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[504px] rounded-2xl overflow-hidden shadow-sm" style={{ border: "1px solid #cfd9de", background: "#ffffff" }}>
      <div className="aspect-[2/1] relative overflow-hidden" style={{ background: "#eff3f4" }}>
        {image ? (
          <img src={image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "#536471" }}>
            No image
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 space-y-0.5">
        <p className="text-sm font-semibold leading-tight line-clamp-2" style={{ color: "#0f1419" }}>
          {title || "Page Title"}
        </p>
        <p className="text-xs line-clamp-2" style={{ color: "#536471" }}>
          {description || "Description"}
        </p>
        <p className="text-xs flex items-center gap-1" style={{ color: "#536471" }}>
          🔗 {domain}
        </p>
      </div>
    </div>
  );
}
