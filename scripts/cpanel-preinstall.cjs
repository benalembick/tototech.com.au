/* eslint-disable @typescript-eslint/no-require-imports */
const { rmSync } = require("node:fs");
const { dirname, join } = require("node:path");

const projectRoot = process.env.CPANEL_APP_ROOT || dirname(process.env.npm_package_json || join(process.cwd(), "package.json"));
const nextBuildPath = join(projectRoot, ".next");

function removeBuildCache(targetPath) {
  rmSync(targetPath, { recursive: true, force: true });
  console.log("[deploy] Cleared stale .next build output.");
}

console.log("[deploy] Preserving cPanel node_modules layout; webpack build will avoid Turbopack symlink handling.");
removeBuildCache(nextBuildPath);
