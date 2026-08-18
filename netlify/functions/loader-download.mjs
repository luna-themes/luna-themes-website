import { getStore } from "@netlify/blobs";

export default async (request) => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }

  const store = getStore("theme-files");
  const file = await store.get("loader-3.9.11.dmg", { type: "arrayBuffer" });

  if (!file) {
    return new Response("LUNA Theme Loader 3.9.11 is not available yet.", { status: 404 });
  }

  return new Response(file, {
    status: 200,
    headers: {
      "Content-Type": "application/x-apple-diskimage",
      "Content-Disposition": "attachment; filename=\"LUNA-Theme-Loader-3.9.11.dmg\"",
      "Cache-Control": "public, max-age=300"
    }
  });
};
