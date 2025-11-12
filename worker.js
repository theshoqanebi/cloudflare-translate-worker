// worker.js
export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);

      // Handle CORS preflight
      if (request.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders() });
      }

      // Only handle POST on this path
      if (request.method !== "POST" || !url.pathname.endsWith("/v1/api/translate/")) {
        return json({ status: "error", error: "Not found" }, 404);
      }

      const body = await request.json().catch(() => null);
      if (!body) {
        return json({ status: "error", error: "Invalid JSON body" }, 400);
      }

      const sl = body["source-lang"];
      const tl = body["target-lang"];
      const q  = body["query"];

      if (!sl || !tl || !q) {
        return json({ status: "error", error: "Missing parameters" }, 400);
      }

      const gUrl = new URL("https://translate.googleapis.com/translate_a/single");
      const gParams = new URLSearchParams({
        client: "gtx",
        dt: "t",
        sl,
        tl,
        q
      });
      gUrl.search = gParams.toString();

      const resp = await fetch(gUrl, {
        method: "GET",
        headers: { "Accept": "application/json" },
      });

      if (!resp.ok) {
        return json({ status: "error", error: "Upstream error" }, 502);
      }

      const data = await resp.json();
      let text = "";
      if (Array.isArray(data?.[0])) {
        text = data[0].map(seg => (Array.isArray(seg) ? seg[0] : "")).join("");
      } else if (typeof data === "string") {
        text = data;
      }

      return json({
        status: "ok",
        result: text,
        "source-lang": sl,
        "target-lang": tl
      });
    } catch (err) {
      return json({ status: "error", error: "Internal error" }, 500);
    }
  }
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...corsHeaders(),
    },
  });
}
