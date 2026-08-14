import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Proxy endpoint to allow seamless iframe embedding without X-Frame-Options or CSP blocking
  app.get("/api/proxy", async (req, res) => {
    const targetUrl = req.query.url as string;
    if (!targetUrl) {
      return res.status(400).send("URL parameter is required");
    }

    try {
      const parsedUrl = new URL(targetUrl);
      const response = await fetch(targetUrl, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      if (!response.ok) {
        return res
          .status(response.status)
          .send(`Failed to fetch target URL: ${response.statusText}`);
      }

      let html = await response.text();

      // Rewrite root-relative URLs (src="/...", href="/...", action="/...") to point to target origin
      const origin = parsedUrl.origin;
      html = html.replace(/(src|href|action)=(["'])\/(?!\/)/gi, (match, attr, quote) => {
        return `${attr}=${quote}${origin}/`;
      });

      // Inject base tag so relative links, images, and styles resolve correctly to original domain
      const baseHref = `${origin}/`;
      const baseTag = `<base href="${baseHref}">`;

      if (html.includes("<head>")) {
        html = html.replace("<head>", `<head>${baseTag}`);
      } else if (html.includes("<HEAD>")) {
        html = html.replace("<HEAD>", `<HEAD>${baseTag}`);
      } else {
        html = `${baseTag}${html}`;
      }

      // Set proper headers and remove framing restrictions
      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.removeHeader("X-Frame-Options");
      res.removeHeader("Content-Security-Policy");
      return res.send(html);
    } catch (error: any) {
      console.error("Proxy error:", error);
      return res.status(500).send(`Error fetching URL: ${error?.message || error}`);
    }
  });

  // API Inspect endpoint to compare metadata, headings, images, scripts between two URLs
  app.get("/api/inspect", async (req, res) => {
    const url1 = req.query.url1 as string;
    const url2 = req.query.url2 as string;

    if (!url1 || !url2) {
      return res.status(400).json({ error: "Both url1 and url2 parameters are required" });
    }

    const inspectSingle = async (targetUrl: string) => {
      const startTime = Date.now();
      try {
        const response = await fetch(targetUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
        });
        const loadTimeMs = Date.now() - startTime;
        const html = await response.text();

        // Extract metadata using regex
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const title = titleMatch ? titleMatch[1].trim() : "No Title";

        const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
          html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
        const description = metaDescMatch ? metaDescMatch[1].trim() : "No description meta tag";

        const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
        const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : null;

        const ogImageMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
        const ogImage = ogImageMatch ? ogImageMatch[1].trim() : null;

        const h1Matches = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
        const h2Matches = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
        const h3Matches = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];
        const imgMatches = html.match(/<img[^>]*>/gi) || [];
        const linkMatches = html.match(/<a[^>]*href=["']([^"']*)["']/gi) || [];
        const scriptMatches = html.match(/<script[^>]*>/gi) || [];
        const styleMatches = html.match(/<link[^>]*rel=["']stylesheet["']/gi) || [];

        // Check for common design framework or dark mode clues
        const hasDarkMode = html.includes("dark") || html.includes("theme-dark") || html.includes("color-scheme");
        const hasTailwind = html.includes("tailwind") || html.includes("tw-") || html.includes("class=");

        return {
          url: targetUrl,
          status: response.status,
          ok: response.ok,
          loadTimeMs,
          htmlSizeKb: Math.round((html.length / 1024) * 10) / 10,
          title,
          description,
          ogTitle,
          ogImage,
          h1Count: h1Matches.length,
          h2Count: h2Matches.length,
          h3Count: h3Matches.length,
          imgCount: imgMatches.length,
          linkCount: linkMatches.length,
          scriptCount: scriptMatches.length,
          styleCount: styleMatches.length,
          hasDarkMode,
          hasTailwind,
          h1List: h1Matches.slice(0, 5).map((m) => m.replace(/<[^>]+>/g, "").trim()),
        };
      } catch (err: any) {
        return {
          url: targetUrl,
          status: 0,
          ok: false,
          loadTimeMs: Date.now() - startTime,
          htmlSizeKb: 0,
          title: "Error loading site",
          description: err?.message || "Failed to fetch site",
          error: true,
          h1Count: 0,
          h2Count: 0,
          h3Count: 0,
          imgCount: 0,
          linkCount: 0,
          scriptCount: 0,
          styleCount: 0,
          hasDarkMode: false,
          hasTailwind: false,
          h1List: [],
        };
      }
    };

    try {
      const [data1, data2] = await Promise.all([inspectSingle(url1), inspectSingle(url2)]);
      return res.json({ site1: data1, site2: data2 });
    } catch (e: any) {
      return res.status(500).json({ error: e?.message || "Failed to inspect sites" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
