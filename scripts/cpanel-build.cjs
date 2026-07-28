/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require("node:child_process");
const { existsSync, lstatSync, rmSync } = require("node:fs");
const { dirname, join } = require("node:path");

const projectRoot = dirname(process.env.npm_package_json || join(process.cwd(), "package.json"));
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

function installLocalDependencies() {
  return spawnSync(npmCommand(), ["install", "--include=dev", "--ignore-scripts"], {
    cwd: projectRoot,
    stdio: "inherit",
    env: {
      ...process.env,
      npm_config_include: "dev",
    },
  });
}

if (nodeModulesIsSymlink()) {
  console.log("[deploy] node_modules is still a symlink; replacing it with a local install before building.");
  rmSync(nodeModulesPath, { force: true });
  const install = installLocalDependencies();

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

if (!existsSync(nextBin)) {
  console.error("[deploy] Cannot find local Next.js binary. Running a local dependency install before building.");
  const install = installLocalDependencies();

  if (install.status !== 0) {
    process.exit(install.status ?? 1);
  }
}

const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
  },
});

process.exit(result.status ?? 1);
