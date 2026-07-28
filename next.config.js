/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // cPanel shared hosting can report many CPUs but still enforce a tight
    // per-process memory envelope during "Run NPM Install" lifecycle tasks.
    // Keep production builds intentionally small and predictable.
    cpus: Number(process.env.NEXT_BUILD_CPUS || "1"),
  },
};

module.exports = nextConfig;
