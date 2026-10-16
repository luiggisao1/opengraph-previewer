import type { OgData } from "@/types/og";

export function LinkedInPreview({ data }: { data: OgData }) {
  const domain = data.url ? new URL(data.url.startsWith("http") ? data.url : `https://${data.url}`).hostname : "example.com";

  return (
    <div className="max-w-[552px] rounded-lg overflow-hidden shadow-sm" style={{ border: "1px solid #e0e0e0", background: "#ffffff" }}>
      <div className="aspect-[1.91/1] overflow-hidden" style={{ background: "#f3f2ef" }}>
        {data.image ? (
          <img src={data.image} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: "#666666" }}>
            No image
          </div>
        )}
      </div>
      <div className="px-3 py-2.5 space-y-0.5">
        <p className="text-sm font-semibold leading-tight line-clamp-2" style={{ color: "#000000e6" }}>
          {data.title || "Page Title"}
        </p>
        <p className="text-[11px]" style={{ color: "#00000099" }}>{domain}</p>
      </div>
    </div>
  );
}
