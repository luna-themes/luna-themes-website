import { getStore } from "@netlify/blobs";

const THEME_ROLES = {
  neve: ["neve", "theme-neve", "neve theme"],
  api: ["api", "theme-api", "api vision theme"]
};

export default async (request, context) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });

  const user = context.clientContext?.user;
  if (!user) return new Response("Please sign in first.", { status: 401 });

  const theme = new URL(request.url).searchParams.get("theme")?.toLowerCase();
  if (!theme || !THEME_ROLES[theme]) return new Response("Unknown theme.", { status: 404 });

  const roles = (user.app_metadata?.roles || []).map(role => String(role).toLowerCase());
  if (!THEME_ROLES[theme].some(role => roles.includes(role))) {
    return new Response("This theme is not assigned to your account.", { status: 403 });
  }

  // Theme ZIPs live in the private Netlify Blobs store "theme-downloads".
  // Upload as: neve.zip and api.zip. They are never exposed by a public URL.
  const store = getStore("theme-downloads");
  const file = await store.get(`${theme}.zip`, { type: "arrayBuffer" });
  if (!file) return new Response("Theme package is not available yet.", { status: 404 });

  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="LUNA-${theme.toUpperCase()}-Theme.zip"`,
      "Cache-Control": "private, no-store"
    }
  });
};
