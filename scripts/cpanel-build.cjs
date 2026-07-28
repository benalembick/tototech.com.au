/* eslint-disable @typescript-eslint/no-require-imports */
const { spawnSync } = require("node:child_process");
const { existsSync } = require("node:fs");
const { dirname, join } = require("node:path");

const projectRoot = process.env.CPANEL_APP_ROOT || dirname(process.env.npm_package_json || join(process.cwd(), "package.json"));
const virtualEnvRoot = process.cwd();

function nextCandidates() {
  return [
    join(projectRoot, "node_modules", "next", "dist", "bin", "next"),
    join(virtualEnvRoot, "node_modules", "next", "dist", "bin", "next"),
    join(dirname(process.env.npm_package_json || join(virtualEnvRoot, "package.json")), "node_modules", "next", "dist", "bin", "next"),
  ];
}

function findNextBin() {
  return nextCandidates().find((candidate) => existsSync(candidate));
}

const nextBin = findNextBin();

if (!nextBin) {
  console.error("[deploy] Cannot find Next.js in either the app node_modules or cPanel virtualenv node_modules.");
  console.error(`[deploy] App root: ${projectRoot}`);
  console.error(`[deploy] Virtualenv root: ${virtualEnvRoot}`);
  console.error("[deploy] Let cPanel finish dependency installation, then run this script again. No nested npm install was attempted.");
  process.exit(1);
}

console.log(`[deploy] Building app from ${projectRoot}`);
console.log(`[deploy] Using Next.js binary at ${nextBin}`);

const result = spawnSync(process.execPath, [nextBin, "build", "--webpack"], {
  cwd: projectRoot,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_TELEMETRY_DISABLED: "1",
    NODE_OPTIONS: [
      process.env.NODE_OPTIONS || "",
      "--max-old-space-size=1536",
    ].join(" ").trim(),
  },
});

process.exit(result.status ?? 1);
