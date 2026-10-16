import type { OgData } from "@/types/og";

export function WhatsAppPreview({ data }: { data: OgData }) {
  const domain = data.url ? new URL(data.url.startsWith("http") ? data.url : `https://${data.url}`).hostname : "example.com";

  return (
    <div className="max-w-[340px] rounded-lg overflow-hidden shadow-sm" style={{ background: "#d9fdd3" }}>
      {data.image && (
        <div className="aspect-[1.91/1] overflow-hidden">
          <img src={data.image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="px-2.5 py-2 space-y-0.5">
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#027eb5" }}>{domain}</p>
        <p className="text-sm font-semibold leading-tight line-clamp-2" style={{ color: "#111b21" }}>
          {data.title || "Page Title"}
        </p>
        <p className="text-xs line-clamp-2" style={{ color: "#667781" }}>
          {data.description || "Description"}
        </p>
      </div>
    </div>
  );
}
