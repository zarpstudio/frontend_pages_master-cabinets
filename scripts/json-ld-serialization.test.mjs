import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { serializeJsonLd } from "../src/lib/json-ld.ts";

// Runs under `node --test`. Repos whose vitest globs also collect this file get
// vitest's `test` instead, so it reports 5 tests rather than an empty suite.
const { test } = process.env.VITEST ? await import("vitest") : await import("node:test");

const walk = (directory) =>
  readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : [path];
  });

const scriptBodies = (html) =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((m) => m[1]);

test("serializes hostile CMS strings as parseable, script-safe JSON-LD", () => {
  const value = "Costs </script><b>INJECTED</b> <!-- <script>alert(1)</script>";
  const serialized = serializeJsonLd({ description: value });

  assert.doesNotMatch(serialized, /<\/?script|<!--/i);
  assert.deepEqual(JSON.parse(serialized), { description: value });

  const servedHtml = `<script type="application/ld+json">${serialized}</script>`;
  const bodies = scriptBodies(servedHtml);
  assert.equal(bodies.length, 1);
  assert.deepEqual(JSON.parse(bodies[0]), { description: value });
  assert.doesNotMatch(servedHtml.replace("</script>", ""), /<b>INJECTED<\/b>/i);
});

// Every JS/TS module an emitter can live in: .js .jsx .ts .tsx .mjs .cjs .mts .cts.
const SOURCE_FILE = /\.[cm]?[jt]sx?$/;

test("every ld+json emitter uses the shared serializer and no local escape rule", () => {
  const sourceRoot = join(process.cwd(), "src");
  // The helper itself names application/ld+json and JSON.stringify in its doc
  // comment and body; its escape rules are checked separately below.
  const helperPath = join(sourceRoot, "lib/json-ld.ts");
  const emitterFiles = walk(sourceRoot).filter(
    (path) =>
      SOURCE_FILE.test(path) &&
      path !== helperPath &&
      readFileSync(path, "utf8").includes("application/ld+json"),
  );
  assert.ok(emitterFiles.length > 0);
  for (const path of emitterFiles) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /JSON\.stringify\(/, path);
    assert.doesNotMatch(source, /\.replace\(\/</, path);
    assert.match(source, /serializeJsonLd\(/, path);
    // A byte-order mark is only valid as the very first character of a file.
    assert.equal(source.indexOf("﻿", 1), -1, `${path}: U+FEFF after the first character`);
  }

  const helper = readFileSync(helperPath, "utf8");
  for (const rule of [".replace(/</g", ".replace(/>/g", ".replace(/&/g"]) {
    assert.ok(helper.includes(rule), `lib/json-ld.ts is missing ${rule}`);
  }
});

test("sofia-scriptbreak fixture: exact '</script><b>INJECTED</b>' leaves no markup outside the script tag", () => {
  const cms = { headline: "</script><b>INJECTED</b>", description: "</script><b>INJECTED</b>" };
  const data = { "@context": "https://schema.org", "@type": "BlogPosting", ...cms };
  const html = `<html><head><script type="application/ld+json">${serializeJsonLd(data)}</script></head><body></body></html>`;
  const bodies = scriptBodies(html);
  assert.equal(bodies.length, 1);
  assert.deepEqual(JSON.parse(bodies[0]), data);
  const outside = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, "");
  assert.doesNotMatch(outside, /INJECTED|<b>/i);
  assert.equal((html.match(/<\/script>/gi) || []).length, 1);
});

test("nested arrays/objects and other HTML-breaking payloads round-trip through JSON.parse", () => {
  const data = {
    "@graph": [{ name: "</SCRIPT ><img src=x onerror=alert(1)>", tags: ["<!--", "]]>", "&amp; &lt;", "  "] }],
  };
  const serialized = serializeJsonLd(data);
  assert.doesNotMatch(serialized, /[<>&]/);
  assert.deepEqual(JSON.parse(serialized), data);
});

test("control: normal CMS strings round-trip unchanged and URLs are not rewritten", () => {
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Roof repair tips for Tampa Bay homeowners",
    description: "It's 100% free & quick — call (813) 555-0100. Café “quotes” ok.",
    url: "https://example.com/blog/roof-repair",
    datePublished: "2026-01-02T03:04:05Z",
    author: { "@type": "Person", name: "Zarp Studio" },
  };
  const serialized = serializeJsonLd(data);
  assert.deepEqual(JSON.parse(serialized), data);
  assert.doesNotMatch(serialized, /[<>&]/);
  assert.ok(serialized.includes('"url":"https://example.com/blog/roof-repair"'), serialized);
  assert.equal(serialized, JSON.stringify(data).replace(/&/g, "\\u0026"));
});
