export const config = {
  runtime: 'edge',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function decodeHtml(str: string): string {
  let decoded = str;
  decoded = decoded.replace(/&amp;/g, '&');
  decoded = decoded.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)));
  decoded = decoded.replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)));
  decoded = decoded.replace(/&lt;/g, '<');
  decoded = decoded.replace(/&gt;/g, '>');
  decoded = decoded.replace(/&quot;/g, '"');
  decoded = decoded.replace(/&apos;/g, "'");
  return decoded;
}

function getMeta(html: string, property: string): string {
  const propRegex = new RegExp(
    `<meta[^>]+(?:property|name)=["']${property}["'][^>]+content=["']([^"']*)["']`,
    'i'
  );
  const match = html.match(propRegex);
  if (match) return match[1];

  const revRegex = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${property}["']`,
    'i'
  );
  const revMatch = html.match(revRegex);
  return revMatch ? revMatch[1] : '';
}

export default async function handler(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { url } = await req.json();
    if (!url) {
      return new Response(JSON.stringify({ error: 'URL is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OGPreviewBot/1.0; +https://ogpreview.app)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to fetch URL: ${response.status} ${response.statusText}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const html = await response.text();

    const rawImage = getMeta(html, 'og:image');
    let image = rawImage;
    if (rawImage) {
      try {
        image = new URL(rawImage, url).href;
      } catch {
        image = rawImage;
      }
    }

    const rawTwitterImage = getMeta(html, 'twitter:image');
    let twitterImage = rawTwitterImage;
    if (rawTwitterImage) {
      try {
        twitterImage = new URL(rawTwitterImage, url).href;
      } catch {
        twitterImage = rawTwitterImage;
      }
    }

    const title = decodeHtml(
      getMeta(html, 'og:title') || html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1] || ''
    );
    const description = decodeHtml(getMeta(html, 'og:description') || getMeta(html, 'description') || '');
    const siteName = decodeHtml(getMeta(html, 'og:site_name') || '');
    const ogUrl = getMeta(html, 'og:url') || url;

    const twitterCard = getMeta(html, 'twitter:card') || '';
    const twitterTitle = decodeHtml(getMeta(html, 'twitter:title') || '');
    const twitterDescription = decodeHtml(getMeta(html, 'twitter:description') || '');

    return new Response(
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
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to fetch OG metadata' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
