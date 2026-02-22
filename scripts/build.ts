import { build } from "esbuild";

await build({
  entryPoints: ["src/index.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "cjs",
  outfile: "dist/index.cjs",
  banner: { js: "#!/usr/bin/env node" },
  external: [],
  minify: false,
  sourcemap: false,
});

console.log("Build complete: dist/index.cjs");
