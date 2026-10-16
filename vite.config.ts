import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import type { Plugin } from "vite";

function ogDevApiPlugin(): Plugin {
  return {
    name: "og-dev-api",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url?.startsWith("/api/fetch-og") && req.method === "POST") {
          let body = "";
          req.on("data", (chunk) => {
            body += chunk;
          });

          req.on("end", async () => {
            try {
              const { url } = JSON.parse(body || "{}");
              if (!url) {
                res.statusCode = 400;
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify({ error: "URL is required" }));
                return;
              }

              const headers = {
                "User-Agent": "Mozilla/5.0 (compatible; OGPreviewBot/1.0)",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
              };

              const urlsToTry = [url];
              if (url.includes("localhost")) {
                urlsToTry.push(url.replace("://localhost", "://127.0.0.1"));
                urlsToTry.push(url.replace("://localhost", "://[::1]"));
              } else if (url.includes("127.0.0.1")) {
                urlsToTry.push(url.replace("://127.0.0.1", "://localhost"));
                urlsToTry.push(url.replace("://127.0.0.1", "://[::1]"));
              }

              let html = "";
              let lastError: any;
              for (const target of urlsToTry) {
                try {
                  const response = await fetch(target, { headers });
                  if (response.ok) {
                    html = await response.text();
                    lastError = null;
                    break;
                  }
                  lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
                } catch (err: any) {
                  lastError = err;
                }
              }

              if (lastError || !html) {
                throw lastError || new Error("Failed to receive HTML response");
              }

              const getMeta = (property: string): string => {
                const propRegex = new RegExp(
                  `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
                  "i"
                );
                const match = html.match(propRegex);
                if (match) return match[1];

                const revRegex = new RegExp(
                  `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
                  "i"
                );
                const revMatch = html.match(revRegex);
                return revMatch ? revMatch[1] : "";
              };

              const decodeHtml = (str: string): string => {
                let decoded = str;
                decoded = decoded.replace(/&amp;/g, "&");
                decoded = decoded.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
                decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
                decoded = decoded.replace(/&lt;/g, "<");
                decoded = decoded.replace(/&gt;/g, ">");
                decoded = decoded.replace(/&quot;/g, '"');
                decoded = decoded.replace(/&apos;/g, "'");
                return decoded;
              };

              const rawImage = getMeta("og:image");
              let image = rawImage;
              if (rawImage) {
                try {
                  image = new URL(rawImage, url).href;
                } catch {
                  image = rawImage;
                }
              }

              const rawTwitterImage = getMeta("twitter:image");
              let twitterImage = rawTwitterImage;
              if (rawTwitterImage) {
                try {
                  twitterImage = new URL(rawTwitterImage, url).href;
                } catch {
                  twitterImage = rawTwitterImage;
                }
              }

              const title = decodeHtml(
                getMeta("og:title") || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || ""
              );
              const description = decodeHtml(getMeta("og:description") || getMeta("description") || "");
              const siteName = decodeHtml(getMeta("og:site_name") || "");
              const ogUrl = getMeta("og:url") || url;

              const twitterCard = getMeta("twitter:card") || "";
              const twitterTitle = decodeHtml(getMeta("twitter:title") || "");
              const twitterDescription = decodeHtml(getMeta("twitter:description") || "");

              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  title,
                  description,
                  image,
                  url: ogUrl,
                  siteName,
                  twitterCard,
                  twitterTitle,
                  twitterDescription,
                  twitterImage,
                })
              );
            } catch (err: any) {
              const detail = err?.cause ? `${err.message} (${err.cause.code || err.cause.message || err.cause})` : (err?.message || "Failed to fetch OG tags");
              console.error("[og-dev-api error]:", detail);
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: detail }));
            }
          });
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [ogDevApiPlugin(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
