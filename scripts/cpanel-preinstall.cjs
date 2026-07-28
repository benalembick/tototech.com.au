/* eslint-disable @typescript-eslint/no-require-imports */
const { lstatSync, rmSync } = require("node:fs");
const { dirname, join } = require("node:path");

const projectRoot = dirname(process.env.npm_package_json || join(process.cwd(), "package.json"));
const nodeModulesPath = join(projectRoot, "node_modules");
const nextBuildPath = join(projectRoot, ".next");

function removeIfSymlink(targetPath) {
  try {
    const stats = lstatSync(targetPath);
    if (!stats.isSymbolicLink()) return;

    rmSync(targetPath, { force: true });
    console.log("[deploy] Removed symlinked node_modules so npm can install local dependencies.");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function removeBuildCache(targetPath) {
  rmSync(targetPath, { recursive: true, force: true });
  console.log("[deploy] Cleared stale .next build output.");
}

removeIfSymlink(nodeModulesPath);
removeBuildCache(nextBuildPath);
