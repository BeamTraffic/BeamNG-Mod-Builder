// INSTALL: /
exports.enabled = false;

// Addon
const sleep = ms => new Promise(r => setTimeout(r, ms));

exports.preBuild = async function () {
    await sleep(1000);
}

exports.postBuild = async function () {
    await sleep(1000);
}