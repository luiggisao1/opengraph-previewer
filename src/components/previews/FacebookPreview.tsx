import type { OgData } from "@/types/og";

export function FacebookPreview({ data }: { data: OgData }) {
  const domain = data.url ? new URL(data.url.startsWith("http") ? data.url : `https://${data.url}`).hostname : "example.com";

  return (
    <div className="max-w-[524px] rounded-sm overflow-hidden shadow-sm" style={{ border: "1px solid #dadde1" }}>
      {/* Image area — Facebook uses ~1.91:1 */}
      <div className="aspect-[1.91/1] overflow-hidden" style={{ background: "#f0f2f5" }}>
        {data.image ? (
          <img src={data.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "#65676b" }}>
            No image provided
          </div>
        )}
      </div>
      {/* Text area */}
      <div className="px-3 py-2.5 space-y-0.5" style={{ background: "#f2f3f5", borderTop: "1px solid #dadde1" }}>
        <p className="text-[11px] uppercase tracking-wide" style={{ color: "#65676b" }}>{domain}</p>
        <p className="text-sm font-semibold leading-tight line-clamp-2" style={{ color: "#1c1e21" }}>
          {data.title || "Page Title"}
        </p>
        <p className="text-xs line-clamp-1" style={{ color: "#65676b" }}>
          {data.description || "Page description will appear here."}
        </p>
      </div>
    </div>
  );
}
