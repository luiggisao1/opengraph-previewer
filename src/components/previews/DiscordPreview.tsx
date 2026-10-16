import type { OgData } from "@/types/og";

export function DiscordPreview({ data }: { data: OgData }) {
  return (
    <div className="max-w-[432px] rounded p-3 space-y-2 shadow-sm" style={{ background: "#2f3136", borderLeft: "4px solid #5865f2" }}>
      <div className="space-y-1">
        {data.siteName && (
          <p className="text-xs font-semibold" style={{ color: "#b9bbbe" }}>{data.siteName}</p>
        )}
        <p className="text-sm font-semibold leading-tight line-clamp-1" style={{ color: "#00aff4" }}>
          {data.title || "Page Title"}
        </p>
        <p className="text-xs line-clamp-3" style={{ color: "#dcddde" }}>
          {data.description || "Description will appear here."}
        </p>
      </div>
      {data.image && (
        <div className="rounded overflow-hidden max-w-[400px]">
          <img src={data.image} alt="" className="w-full rounded object-cover max-h-[200px]" />
        </div>
      )}
    </div>
  );
}
