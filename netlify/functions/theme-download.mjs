import { getUser } from "@netlify/identity";

const THEME_ROLES = {
  neve: ["neve", "theme-neve", "neve theme"],
  api: ["api", "theme-api", "api vision theme"]
};

const THEME_ENV = {
  neve: "NEVE_THEME_DOWNLOAD_URL",
  api: "API_THEME_DOWNLOAD_URL"
};

export default async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const user = await getUser();
  if (!user) return new Response("Please sign in first.", { status: 401 });

  const theme = new URL(request.url).searchParams.get("theme")?.toLowerCase();
  if (!theme || !THEME_ROLES[theme]) return new Response("Unknown theme.", { status: 404 });

  const roles = (user.roles || []).map(role => String(role).toLowerCase());
  if (!THEME_ROLES[theme].some(role => roles.includes(role))) {
    return new Response("This theme is not assigned to your account.", { status: 403 });
  }

  const sourceUrl = process.env[THEME_ENV[theme]];
  if (!sourceUrl) return new Response("Theme package is not available yet.", { status: 404 });

  const source = await fetch(sourceUrl);
  if (!source.ok || !source.body) return new Response("Theme package could not be loaded.", { status: 502 });

  return new Response(source.body, {
    status: 200,
    headers: {
      "Content-Type": source.headers.get("content-type") || "application/zip",
      "Content-Disposition": `attachment; filename="LUNA-${theme.toUpperCase()}-Theme.zip"`,
      "Cache-Control": "private, no-store"
    }
  });
};
