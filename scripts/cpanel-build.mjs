import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, rmSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const projectRoot = process.cwd();
const nodeModulesPath = join(projectRoot, "node_modules");
const nextBin = join(projectRoot, "node_modules", "next", "dist", "bin", "next");

function npmCommand() {
  return process.platform === "win32" ? "npm.cmd" : "npm";
}

function nodeModulesIsSymlink() {
  try {
    return lstatSync(nodeModulesPath).isSymbolicLink();
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

if (nodeModulesIsSymlink()) {
  console.log("[deploy] node_modules is still a symlink; replacing it with a local install before building.");
  rmSync(nodeModulesPath, { force: true });
  const install = spawnSync(npmCommand(), ["install", "--include=dev", "--ignore-scripts"], {
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_include: "dev",
    },
  });

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

if (!existsSync(nextBin)) {
  console.error("[deploy] Cannot find local Next.js binary. Running a local dependency install before building.");
  const install = spawnSync(npmCommand(), ["install", "--include=dev", "--ignore-scripts"], {
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_include: "dev",
    },
  });

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

process.exit(result.status ?? 1);
