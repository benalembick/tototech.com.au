import { lstatSync, rmSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const nodeModulesPath = join(projectRoot, "node_modules");
const nextBuildPath = join(projectRoot, ".next");

function removeIfSymlink(path) {
  try {
    const stats = lstatSync(path);
    if (!stats.isSymbolicLink()) return;

    rmSync(path, { force: true });
    console.log("[deploy] Removed symlinked node_modules so npm can install local dependencies.");
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

function removeBuildCache(path) {
  rmSync(path, { recursive: true, force: true });
  console.log("[deploy] Cleared stale .next build output.");
}

removeIfSymlink(nodeModulesPath);
removeBuildCache(nextBuildPath);
