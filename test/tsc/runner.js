const path = require("path");
const glob = require("glob");
const { spawnSync } = require("child_process");

const projects = glob.sync(path.join(__dirname, "**/tsconfig.json"));

const runAll = () => {
  let hasError = false;
  for (const p of projects) {
    console.info(`testing ${p} ...`);
    const outDir = path.join(path.dirname(p), ".temp");
    const { status } = spawnSync("tsc", ["-p", p, "--outDir", outDir], {
      shell: true,
      stdio: "inherit"
    });
    if (status !== 0) {
      hasError = true;
    }
  }
  return hasError ? 1 : 0;
};

process.exit(runAll());
