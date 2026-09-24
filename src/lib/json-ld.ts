/**
 * Serializes structured data for the body of a
 * `<script type="application/ld+json">` element.
 *
 * The HTML tokenizer ends a script element at the first `</script`, and treats
 * `<!--` specially, no matter what the JSON means. CMS copy can contain both.
 * Escaping `<`, `>` and `&` as JSON unicode escapes keeps any string inside the
 * element, and `JSON.parse` turns the escapes back into the original
 * characters, so the structured data is unchanged. `/` is left as is: once `<`
 * is escaped it can no longer start a closing tag, and URLs stay readable.
 *
 * Every ld+json emitter must use this function instead of `JSON.stringify`
 * (enforced by scripts/json-ld-serialization.test.mjs).
 */
export function serializeJsonLd(data: object): string {
  const json = JSON.stringify(data);

  if (json === undefined) {
    throw new TypeError("JSON-LD data must be JSON-serializable");
  }

  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
