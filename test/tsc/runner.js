const path = require("path");
const glob = require("glob");
const { Tester, formatFailureMessage } = require("tsc-test");

const projects = glob.sync(path.join(__dirname, "**/tsconfig.json"));
const errors = [];
projects.forEach(p => {
    const tester = Tester.fromConfigFile(p);
    let failed = false;
    tester.testAll((fileName, failures) => {
        if (failures.length > 0) {
            errors.push([fileName, formatFailureMessage(...failures)]);
            failed = true;
        }
    });
    if (failed) {
        console.info("NG:", p);
    }
    else {
        console.info("OK:", p);
    }
});

if (errors.length > 0) {
    console.error("");
    errors.forEach(e => {
        console.error(e[0] + "\n" + e[1] + "\n");
    });
}

process.exit(errors.length === 0 ? 0 : 1);

