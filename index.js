// require modules
const fs = require('fs');
const archiver = require('archiver');
const path = require('path');
const chalk = require('chalk');

const { version } = require(path.join(__dirname, '../settings/resource.json')); //Gets mod version from the beamng mod 'settings/resource.json' file

const logEmpty = () => console.log("");
const logLine  = () => console.log(chalk.yellow("--------------------------------------------------------------------------------"));

var startTime, endTime;

// Create a config if none exists
const configPath = path.join(__dirname, "config.json");
if(!fs.existsSync(configPath)) {
  const defaultConfig = {
    modName: "BuilderDefaultName",
    runAddons: false,
    ignoneDotFiles: true,
    ignoredPaths: ["EXAMPLE"]
  };
  fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
}

// Load config
const config = require('./config.json');
const outputName = config.modName;

if(outputName == "BuilderDefaultName") {
  console.log(chalk.red("Skipping build, mod name is the default one, please change it!"))
  return;
};

// Create output directory
const outputdir = path.join(__dirname, '../.builds');
const outputdirversions = path.join(__dirname, '../.builds/versions');

if (!fs.existsSync(outputdir)){
  fs.mkdirSync(outputdir);
}

if (!fs.existsSync(outputdirversions)){
  fs.mkdirSync(outputdirversions);
}

const outputPath = path.join(__dirname, '../.builds', `/${outputName}.zip`);

// Load addons
var addons = [];
function loadAddons() {
  logLine();
  console.log(chalk.green('Loading Addons'))

  for(const addonFile of fs.readdirSync(path.join(__dirname, './addons'))) {
    const addon = require(`./addons/${addonFile}`)
    if(!addon.enabled) continue;
    console.log(chalk.blue(`Loaded Addon: ${addonFile.replace(".js", "")}`))
    addons.push(addon);
  }
}
if(config.runAddons) loadAddons();

// Create a file to stream archive data to.
const output = fs.createWriteStream(outputPath);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

// When the build is finished
output.on('close', async function() {
  logLine();
  console.log(chalk.magenta('RUNNING POST-BUILD'));

  for(const addon of addons) {
    if(addon.postBuild) await addon.postBuild();
  }

  fs.copyFileSync(outputPath, path.join(outputdirversions, `${outputName}_v${version}.zip`))

  endTime = Date.now();

  console.log(chalk.green(`BUILD SUCCESS | ${outputName} v${version}`))
  logLine();
  console.log(chalk.blue(`Total Time: ${((endTime - startTime)/ 1000).toFixed(2)}s`))
  console.log(chalk.blue(`Finished At: ${(new Date).toString()}`))
  logLine();
  logEmpty();
});

// When the build encounters an error
archive.on('error', function(err) {
  logLine()
  console.log(chalk.red("BUILD FAIL"));
  logLine()
  logEmpty();
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Append files to archive
for(const dir of fs.readdirSync(path.join(__dirname, '../'))) {
  if(config.ignoneDotFiles && dir.startsWith('.')) continue;
  if(config.ignoredPaths.includes(dir)) continue;

  const dirPath = path.join(__dirname, '../', dir);
  const isFile = fs.statSync(path.join(__dirname, '../', dir)).isFile();

  if(isFile) {
    archive.file(dirPath, { name: dir });
  } else {
    archive.directory(dirPath, dir);
  }
}

async function runBuild() {
  startTime = Date.now()
  logLine();
  console.log(chalk.red(`BUILDING ${outputName} v${version}`));

  for(const addon of addons) {
    if(addon.preBuild) await addon.preBuild();
  }

  // Start the zip archiving process
  archive.finalize();
}

runBuild();