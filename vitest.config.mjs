/**
 * Vitest config for the server-side unit tests under src/**\/__tests__.
 *
 * The repo does not pin a test runner, so this file has no imports and needs
 * nothing installed. Run the suite with:
 *
 *   pnpm dlx vitest@3.2.4 run
 *
 * `.mjs` sits outside tsconfig's `include`, so this file is invisible to
 * `tsc --noEmit` and to `next build`.
 */
const srcDir = new URL("./src", import.meta.url).pathname

const vitestConfig = {
  resolve: {
    alias: { "@": srcDir },
  },
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/__tests__/**/*.test.ts"],
  },
}

export default vitestConfig
