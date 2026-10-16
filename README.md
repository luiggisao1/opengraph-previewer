# 🔍 OG Previewer

> A fast, pixel-accurate OpenGraph and Twitter Card previewer and validator. Inspect how your links look across **Facebook, Twitter/X, LinkedIn, WhatsApp, Discord, Slack, and Telegram** before publishing.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-og.duiggi.dev-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://og.duiggi.dev)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## ✨ Features

- **7 Platform Previews** — Pixel-accurate rendering for:
  - **Facebook** (Large image feed cards)
  - **Twitter / X** (`summary` & `summary_large_image` cards)
  - **LinkedIn** (Post snippet cards)
  - **WhatsApp** (Chat link preview bubbles)
  - **Discord** (Embed cards)
  - **Slack** (Workspace message unfurls)
  - **Telegram** (Instant message link previews)
- **Live Tag Editor** — Real-time editing for `og:title`, `og:description`, `og:image`, `og:url`, and `og:site_name`.
- **Twitter Card Customization** — Fine-tune `twitter:card`, `twitter:title`, `twitter:description`, and `twitter:image` independently.
- **Serverless URL Scraping** — Built-in Edge API route (`/api/fetch-og`) scrapes and parses HTML `<meta>` tags from any live site without client-side CORS issues.
- **Local Development Support** — Vite dev server proxy enables previewing local servers (e.g. `http://localhost:8081` or `127.0.0.1`) directly while developing.
- **Raw HTML Meta Paste** — Paste `<meta ...>` tags or complete `<head>` HTML to populate fields instantly.
- **Image Validation & Dimension Guide** — Aspect ratio guidelines and resolution checks for each social platform.
- **One-Click Snippet Export** — Instantly copy optimized HTML meta tags ready to paste into your `<head>`.
- **Dark & Light Mode** — Native app theme switching with platform previews maintaining their authentic platform backgrounds.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Backend / API** | [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions) (zero external database) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 18
- `npm`, `pnpm`, or `bun`

### Installation

```bash
# Clone the repository
git clone https://github.com/duiggi/opengraph-previewer.git
cd opengraph-previewer

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

> **Localhost Testing:** You can test other local projects (e.g. `http://localhost:8081`) directly into the fetch bar. The local Vite proxy handles the connection and bypasses browser CORS.

---

## 🏗 Architecture & Project Structure

```
opengraph-previewer/
├── api/
│   └── fetch-og.ts             # Vercel Serverless Edge Function for live URL scraping
├── public/
│   ├── favicon.ico             # Brand favicon
│   └── favicon.svg             # Vector favicon
├── src/
│   ├── components/
│   │   ├── previews/           # Platform-specific preview cards
│   │   │   ├── DiscordPreview.tsx
│   │   │   ├── FacebookPreview.tsx
│   │   │   ├── LinkedInPreview.tsx
│   │   │   ├── SlackPreview.tsx
│   │   │   ├── TelegramPreview.tsx
│   │   │   ├── TwitterPreview.tsx
│   │   │   └── WhatsAppPreview.tsx
│   │   ├── OgEditor.tsx        # Tag input controls and Twitter card editors
│   │   └── ThemeToggle.tsx     # Theme switcher
│   ├── pages/
│   │   ├── Index.tsx           # Main application view
│   │   └── NotFound.tsx        # 404 handler
│   ├── types/
│   │   └── og.ts               # Metadata data types
│   └── App.tsx                 # App entry and providers
├── vercel.json                 # Vercel rewrites and edge routing
└── vite.config.ts              # Vite configuration + local /api/fetch-og middleware
```

---

## ☁️ Deployment

This project is optimized for deployment on **[Vercel](https://vercel.com/)** with zero external database dependencies:

1. Push your repository to GitHub.
2. In Vercel, select **Add New Project** > **Import**.
3. Vercel automatically detects **Vite**.
4. Click **Deploy**.

The Vercel Edge Function (`/api/fetch-og`) and SPA rewrites (`vercel.json`) are automatically provisioned out of the box with **no environment variables required**.

---

## 👤 Author

**Luiggi Alarcon**
- Website: [duiggi.dev](https://duiggi.dev)
- Tool: [og.duiggi.dev](https://og.duiggi.dev)
- GitHub: [@duiggi](https://github.com/duiggi)

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
