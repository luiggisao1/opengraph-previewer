import { useState } from "react";
import { OgEditor } from "@/components/OgEditor";
import { TwitterCardEditor } from "@/components/OgEditor";
import { FacebookPreview } from "@/components/previews/FacebookPreview";
import { TwitterPreview } from "@/components/previews/TwitterPreview";
import { LinkedInPreview } from "@/components/previews/LinkedInPreview";
import { WhatsAppPreview } from "@/components/previews/WhatsAppPreview";
import { DiscordPreview } from "@/components/previews/DiscordPreview";
import { SlackPreview } from "@/components/previews/SlackPreview";
import { TelegramPreview } from "@/components/previews/TelegramPreview";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { OgData } from "@/types/og";
import { Eye, Code2, Copy, Check, Globe, Loader2, FileCode, RotateCcw } from "lucide-react";
import { toast } from "sonner";

const defaultData: OgData = {
  title: "My Amazing Website",
  description: "Discover the best content, tools, and resources all in one place.",
  image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&h=630&fit=crop",
  url: "https://example.com",
  siteName: "Example",
};

const platforms = [
  { id: "facebook", label: "Facebook", Component: FacebookPreview },
  { id: "twitter", label: "Twitter / X", Component: TwitterPreview },
  { id: "linkedin", label: "LinkedIn", Component: LinkedInPreview },
  { id: "whatsapp", label: "WhatsApp", Component: WhatsAppPreview },
  { id: "discord", label: "Discord", Component: DiscordPreview },
  { id: "slack", label: "Slack", Component: SlackPreview },
  { id: "telegram", label: "Telegram", Component: TelegramPreview },
] as const;

const Index = () => {
  const [data, setData] = useState<OgData>(defaultData);
  const [copied, setCopied] = useState(false);
  const [twitterCopied, setTwitterCopied] = useState(false);
  const [fetchUrl, setFetchUrl] = useState("");
  const [fetching, setFetching] = useState(false);
  const [htmlInput, setHtmlInput] = useState("");
  const [inputMode, setInputMode] = useState<"url" | "html">("url");
  const [activeTab, setActiveTab] = useState("facebook");

  const parseMetaFromHtml = (html: string) => {
    const getMeta = (prop: string): string => {
      const r1 = new RegExp(`<meta[^>]+(?:property|name)=["']${prop}["'][^>]+content=["']([^"']*)["']`, 'i');
      const m1 = html.match(r1);
      if (m1) return m1[1];
      const r2 = new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${prop}["']`, 'i');
      const m2 = html.match(r2);
      return m2 ? m2[1] : '';
    };

    const parsed: Partial<OgData> = {};
    const title = getMeta('og:title');
    const description = getMeta('og:description') || getMeta('description');
    const image = getMeta('og:image');
    const url = getMeta('og:url');
    const siteName = getMeta('og:site_name');
    const twitterCard = getMeta('twitter:card');
    const twitterTitle = getMeta('twitter:title');
    const twitterDescription = getMeta('twitter:description');
    const twitterImage = getMeta('twitter:image');

    if (title || description || image || url || siteName || twitterCard || twitterTitle) {
      setData({
        title: title || data.title,
        description: description || data.description,
        image: image || data.image,
        url: url || data.url,
        siteName: siteName || data.siteName,
        twitterCard: twitterCard || "",
        twitterTitle: twitterTitle || "",
        twitterDescription: twitterDescription || "",
        twitterImage: twitterImage || "",
      });
      toast.success("Meta tags parsed successfully");
    } else {
      toast.error("No valid meta tags found in the HTML");
    }
  };

  const decodeHtmlEntities = (str: string): string => {
    const el = document.createElement("textarea");
    el.innerHTML = str;
    return el.value;
  };

  const getMetaTags = () => `<meta property="og:title" content="${data.title}" />
<meta property="og:description" content="${data.description}" />
<meta property="og:image" content="${data.image}" />
<meta property="og:url" content="${data.url}" />
<meta property="og:site_name" content="${data.siteName}" />
<meta property="og:type" content="website" />

<!-- Twitter Card -->
<meta name="twitter:card" content="${data.twitterCard || 'summary_large_image'}" />
<meta name="twitter:title" content="${data.twitterTitle || data.title}" />
<meta name="twitter:description" content="${data.twitterDescription || data.description}" />
<meta name="twitter:image" content="${data.twitterImage || data.image}" />`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getMetaTags());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isValidUrl = (str: string): boolean => {
    try {
      const u = new URL(str);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleFetchUrl = async () => {
    const trimmed = fetchUrl.trim();
    if (!trimmed) return;
    if (!isValidUrl(trimmed)) {
      toast.error("Enter a valid URL (e.g. https://example.com)");
      return;
    }
    setFetching(true);
    try {
      const response = await fetch("/api/fetch-og", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: trimmed }),
      });

      let result: any = {};
      try {
        result = await response.json();
      } catch {
        result = { error: `Server returned ${response.status} ${response.statusText}` };
      }

      if (!response.ok || result?.error) {
        throw new Error(result?.error || `Request failed with status ${response.status}`);
      }

      setData({
        title: decodeHtmlEntities(result.title || ""),
        description: decodeHtmlEntities(result.description || ""),
        image: result.image || "",
        url: result.url || trimmed,
        siteName: decodeHtmlEntities(result.siteName || ""),
        twitterCard: result.twitterCard || "",
        twitterTitle: decodeHtmlEntities(result.twitterTitle || ""),
        twitterDescription: decodeHtmlEntities(result.twitterDescription || ""),
        twitterImage: result.twitterImage || "",
      });
      toast.success("OG tags loaded successfully");
    } catch (err: any) {
      const msg = err.message || "Failed to fetch OG tags";
      if (msg.includes("dns error") || msg.includes("failed to lookup")) {
        toast.error("Could not reach the site. Make sure the URL exists and is accessible.");
      } else {
        toast.error(msg);
      }
    } finally {
      setFetching(false);
    }
  };

  const handleReset = () => {
    setData(defaultData);
    setFetchUrl("");
    setHtmlInput("");
    toast.success("Reset to defaults");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold tracking-tight">OG Preview</h1>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono font-medium">
              v1.0
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground gap-1.5">
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8">
          {/* Editor Panel */}
          <aside className="lg:sticky lg:top-8 lg:self-start space-y-4">
            {/* Import OG tags */}
            <div className="rounded-xl border bg-card p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium flex items-center gap-1.5">
                  {inputMode === "url" ? (
                    <Globe className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <FileCode className="h-4 w-4 text-muted-foreground" />
                  )}
                  {inputMode === "url" ? "Fetch from URL" : "Paste HTML"}
                </label>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs h-7 px-2 text-muted-foreground"
                  onClick={() => setInputMode(inputMode === "url" ? "html" : "url")}
                >
                  {inputMode === "url" ? "Paste HTML instead" : "Fetch from URL instead"}
                </Button>
              </div>

              {inputMode === "url" ? (
                <div className="flex gap-2">
                  <Input
                    value={fetchUrl}
                    onChange={(e) => setFetchUrl(e.target.value)}
                    placeholder="https://example.com"
                    onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
                  />
                  <Button onClick={handleFetchUrl} disabled={fetching} size="sm" className="shrink-0">
                    {fetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={htmlInput}
                    onChange={(e) => setHtmlInput(e.target.value)}
                    placeholder={'<meta property="og:title" content="My Site" />\n<meta property="og:description" content="..." />'}
                    rows={5}
                    className="font-mono text-xs"
                  />
                  <Button
                    onClick={() => parseMetaFromHtml(htmlInput)}
                    disabled={!htmlInput.trim()}
                    size="sm"
                    variant="secondary"
                    className="w-full"
                  >
                    Parse Meta Tags
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border bg-card p-5">
              <OgEditor data={data} onChange={setData} />
            </div>

            {/* Code snippet */}
            <details className="rounded-xl border bg-card overflow-hidden">
              <summary className="px-4 py-3 text-sm font-medium cursor-pointer flex items-center gap-2 hover:bg-muted/50 transition-colors">
                <Code2 className="h-4 w-4 text-muted-foreground" />
                HTML Meta Tags
              </summary>
              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 border hover:bg-muted transition-colors"
                  title="Copiar al portapapeles"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                </button>
                <pre className="px-4 py-3 text-xs font-mono bg-muted/30 overflow-x-auto whitespace-pre-wrap break-all text-muted-foreground">
                  {getMetaTags()}
                </pre>
              </div>
            </details>
          </aside>

          {/* Preview Panel */}
          <main>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6 flex-wrap h-auto gap-1 bg-muted/50 p-1">
                {platforms.map((p) => (
                  <TabsTrigger key={p.id} value={p.id} className="text-sm">
                    {p.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              {platforms.map(({ id, label, Component }) => (
                <TabsContent key={id} value={id} className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    How your link will appear on <span className="font-semibold text-foreground">{label}</span>
                  </p>
                  <Component data={data} />
                </TabsContent>
              ))}
            </Tabs>

            {activeTab === "twitter" && (
              <div className="mt-6 space-y-4">
                <TwitterCardEditor data={data} onChange={setData} />
                <details className="rounded-xl border bg-card overflow-hidden">
                  <summary className="px-4 py-3 text-sm font-medium cursor-pointer flex items-center gap-2 hover:bg-muted/50 transition-colors">
                    <Code2 className="h-4 w-4 text-muted-foreground" />
                    Twitter Card Meta Tags
                  </summary>
                  <div className="relative">
                    <button
                      onClick={async () => {
                        const tags = `<meta name="twitter:card" content="${data.twitterCard || 'summary_large_image'}" />\n<meta name="twitter:title" content="${data.twitterTitle || data.title}" />\n<meta name="twitter:description" content="${data.twitterDescription || data.description}" />\n<meta name="twitter:image" content="${data.twitterImage || data.image}" />`;
                        await navigator.clipboard.writeText(tags);
                        setTwitterCopied(true);
                        setTimeout(() => setTwitterCopied(false), 2000);
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-md bg-background/80 border hover:bg-muted transition-colors"
                      title="Copy to clipboard"
                    >
                      {twitterCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-muted-foreground" />}
                    </button>
                    <pre className="px-4 py-3 text-xs font-mono bg-muted/30 overflow-x-auto whitespace-pre-wrap break-all text-muted-foreground">
{`<meta name="twitter:card" content="${data.twitterCard || 'summary_large_image'}" />
<meta name="twitter:title" content="${data.twitterTitle || data.title}" />
<meta name="twitter:description" content="${data.twitterDescription || data.description}" />
<meta name="twitter:image" content="${data.twitterImage || data.image}" />`}
                    </pre>
                  </div>
                </details>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Index;
