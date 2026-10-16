import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2, Image as ImageIcon, Info, Ruler } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { OgData } from "@/types/og";

// Exported separately for use in the preview panel
export function TwitterCardEditor({ data, onChange }: { data: OgData; onChange: (data: OgData) => void }) {
  const update = (field: keyof OgData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div>
        <h2 className="text-lg font-semibold mb-1">Twitter Card</h2>
        <p className="text-sm text-muted-foreground">
          Override how your link appears on Twitter/X
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tw-card" className="text-sm font-medium">twitter:card</Label>
        <Select
          value={data.twitterCard || "summary_large_image"}
          onValueChange={(v) => update("twitterCard", v)}
        >
          <SelectTrigger id="tw-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summary_large_image">summary_large_image</SelectItem>
            <SelectItem value="summary">summary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tw-title" className="text-sm font-medium">
          twitter:title
          <span className="ml-2 text-xs text-muted-foreground font-mono">
            {(data.twitterTitle || "").length}/70
          </span>
        </Label>
        <Input
          id="tw-title"
          value={data.twitterTitle || ""}
          onChange={(e) => update("twitterTitle", e.target.value)}
          placeholder={data.title || "Falls back to og:title"}
          className={(data.twitterTitle?.length || 0) > 70 ? "border-warning" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tw-desc" className="text-sm font-medium">
          twitter:description
          <span className="ml-2 text-xs text-muted-foreground font-mono">
            {(data.twitterDescription || "").length}/200
          </span>
        </Label>
        <Textarea
          id="tw-desc"
          value={data.twitterDescription || ""}
          onChange={(e) => update("twitterDescription", e.target.value)}
          placeholder={data.description || "Falls back to og:description"}
          rows={2}
          className={(data.twitterDescription?.length || 0) > 200 ? "border-warning" : ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tw-image" className="text-sm font-medium flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" />
          twitter:image
        </Label>
        <Input
          id="tw-image"
          value={data.twitterImage || ""}
          onChange={(e) => update("twitterImage", e.target.value)}
          placeholder={data.image || "Falls back to og:image"}
        />
      </div>
    </div>
  );
}

interface OgEditorProps {
  data: OgData;
  onChange: (data: OgData) => void;
}

interface ValidationRule {
  field: keyof OgData;
  label: string;
  maxLength?: number;
  required?: boolean;
}

const rules: ValidationRule[] = [
  { field: "title", label: "Title", maxLength: 60, required: true },
  { field: "description", label: "Description", maxLength: 155, required: true },
  { field: "image", label: "Image URL", required: true },
  { field: "url", label: "URL", required: true },
  { field: "siteName", label: "Site Name" },
];

const platformImageSpecs = [
  { name: "Facebook", recommended: "1200×630", minW: 600, minH: 315, idealW: 1200, idealH: 630, ratio: "1.91:1" },
  { name: "Twitter / X", recommended: "1200×628", minW: 300, minH: 157, idealW: 1200, idealH: 628, ratio: "1.91:1" },
  { name: "LinkedIn", recommended: "1200×627", minW: 1200, minH: 627, idealW: 1200, idealH: 627, ratio: "1.91:1" },
  { name: "WhatsApp", recommended: "600×600", minW: 300, minH: 300, idealW: 600, idealH: 600, ratio: "1:1" },
  { name: "Discord", recommended: "1200×630", minW: 256, minH: 256, idealW: 1200, idealH: 630, ratio: "1.91:1" },
  { name: "Slack", recommended: "800×418", minW: 250, minH: 250, idealW: 800, idealH: 418, ratio: "1.91:1" },
  { name: "Telegram", recommended: "1200×630", minW: 300, minH: 300, idealW: 1200, idealH: 630, ratio: "1.91:1" },
];

function useImageDimensions(url: string) {
  const [dims, setDims] = useState<{ width: number; height: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) { setDims(null); return; }
    setLoading(true);
    const img = new Image();
    img.onload = () => {
      setDims({ width: img.naturalWidth, height: img.naturalHeight });
      setLoading(false);
    };
    img.onerror = () => {
      setDims(null);
      setLoading(false);
    };
    img.src = url;
  }, [url]);

  return { dims, loading };
}

export function OgEditor({ data, onChange }: OgEditorProps) {
  const { dims, loading: dimsLoading } = useImageDimensions(data.image);

  const issues = rules
    .map((r) => {
      const val = data[r.field];
      if (r.required && !val) return { type: "error" as const, msg: `${r.label} is missing` };
      if (r.maxLength && val && val.length > r.maxLength)
        return { type: "recommendation" as const, msg: `${r.label} exceeds recommended length (${val.length}/${r.maxLength}). It may be truncated on some platforms.` };
      return null;
    })
    .filter(Boolean) as { type: "error" | "recommendation"; msg: string }[];

  const imageIssues = dims
    ? platformImageSpecs
        .filter((p) => dims.width < p.minW || dims.height < p.minH)
        .map((p) => ({
          type: "recommendation" as const,
          msg: `Image too small for ${p.name} (min ${p.minW}×${p.minH}). Current: ${dims.width}×${dims.height}.`,
        }))
    : [];

  const update = (field: keyof OgData, value: string) =>
    onChange({ ...data, [field]: value });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-1">Meta Tags</h2>
        <p className="text-sm text-muted-foreground">
          Edit your OpenGraph tags and see live previews
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="og-title" className="text-sm font-medium">
            og:title
            <span className="ml-2 text-xs text-muted-foreground font-mono">
              {data.title.length}/60
            </span>
          </Label>
          <Input
            id="og-title"
            value={data.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="My Awesome Page"
            className={data.title.length > 60 ? "border-warning" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="og-desc" className="text-sm font-medium">
            og:description
            <span className="ml-2 text-xs text-muted-foreground font-mono">
              {data.description.length}/155
            </span>
          </Label>
          <Textarea
            id="og-desc"
            value={data.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="A brief description of the page content..."
            rows={3}
            className={data.description.length > 155 ? "border-warning" : ""}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="og-image" className="text-sm font-medium flex items-center gap-1.5">
            <ImageIcon className="h-3.5 w-3.5" />
            og:image
          </Label>
          <Input
            id="og-image"
            value={data.image}
            onChange={(e) => update("image", e.target.value)}
            placeholder="https://example.com/og-image.jpg"
          />
          {data.image && (
            <div className="mt-2 rounded-md border overflow-hidden bg-muted/50">
              <img
                src={data.image}
                alt="OG Preview"
                className="w-full h-32 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="og-url" className="text-sm font-medium">og:url</Label>
          <Input
            id="og-url"
            value={data.url}
            onChange={(e) => update("url", e.target.value)}
            placeholder="https://example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="og-site" className="text-sm font-medium">og:site_name</Label>
          <Input
            id="og-site"
            value={data.siteName}
            onChange={(e) => update("siteName", e.target.value)}
            placeholder="My Website"
          />
        </div>
      </div>

      {/* Validation */}
      <div className="rounded-lg border p-4 space-y-3">
        <h3 className="text-sm font-semibold mb-2">Validation</h3>
        {issues.length === 0 && imageIssues.length === 0 ? (
          <div className="flex items-center gap-2 text-accent text-sm">
            <CheckCircle2 className="h-4 w-4" />
            All tags look good!
          </div>
        ) : (
          [...issues, ...imageIssues].map((issue, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 text-sm ${
                issue.type === "error" ? "text-warning" : "text-muted-foreground"
              }`}
            >
              {issue.type === "error" ? (
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              ) : (
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
              )}
              {issue.msg}
            </div>
          ))
        )}
      </div>

      {/* Image dimensions per platform */}
      {dims && (
        <div className="rounded-lg border p-4 space-y-2">
          <h3 className="text-sm font-semibold flex items-center gap-1.5 mb-2">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            Image: {dims.width}×{dims.height}px
          </h3>
          <div className="space-y-1.5">
            <TooltipProvider delayDuration={200}>
            {platformImageSpecs.map((p) => {
              const ok = dims.width >= p.minW && dims.height >= p.minH;
              const perfect = dims.width >= p.idealW && dims.height >= p.idealH;
              const tooltipText = perfect
                ? `✅ Meets ideal size (${p.idealW}×${p.idealH})`
                : ok
                ? `ℹ️ Meets minimum (${p.minW}×${p.minH}) but below ideal (${p.idealW}×${p.idealH})`
                : `⚠️ Below minimum ${p.minW}×${p.minH}. Ideal: ${p.idealW}×${p.idealH}`;
              return (
                <Tooltip key={p.name}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center justify-between text-xs cursor-help">
                      <span className="text-muted-foreground">{p.name}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-muted-foreground">{p.recommended} ({p.ratio})</span>
                        {perfect ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                        ) : ok ? (
                          <Info className="h-3.5 w-3.5 text-muted-foreground" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 text-warning" />
                        )}
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="text-xs max-w-[250px]">
                    {tooltipText}
                  </TooltipContent>
                </Tooltip>
              );
            })}
            </TooltipProvider>
          </div>
        </div>
      )}
      {dimsLoading && data.image && (
        <p className="text-xs text-muted-foreground">Loading image dimensions…</p>
      )}
    </div>
  );
}
