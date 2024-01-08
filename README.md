# BeamNG Mod Builder
A mod builder for [BeamNG.drive](https://www.beamng.com)!

Made to facilitate zipping BeamNG mods!

# Features
* Automatic Mod Packaging: Streamlines the process of creating a zip file for the mod.
* Addon Support: Ability to load and run addons to extend functionality.
* Pre & Post-Build Operations: Facilitates additional operations before and after the build process.

# Installation
1. Clone the repository in your mod directory as `.builder`.
2. Go into the `.builder` directory with your command line (`cd .builder`).
3. Run `npm install` to install the required dependencies.
4. Edit the `config.json` file to your desired configuration. (*You must change the mod name for the build to even start*)

# Configuration
Edit `config.json` to change the builder settings. Available options include:
* `modName`: Name of the mod for the zip file.
* `runAddons`: Boolean to toggle running addons.
* `ignoneDotFiles`: Boolean to ignore files and directories starting with a dot (Examples: `.gitignore`, `.vscode`).
* `ignoredPaths`: Array of paths to ignore during packaging.

# Usage
1. Have a terminal with your mod directory open.
2. Run `node .builder`.

# Usage with VS-Code
1. Open your mod project with VS-Code.
2. Make a `.vscode` folder in your main folder.
3. In this folder make a `tasks.json` file and put the following contents:
```json
{
  "tasks": [
    {
      "label": "build",
      "type": "shell",
      "command": "node .builder"
    }
  ]
}
```
4. And now you can run the build task, default shortcut is: `Ctrl` + `Shift` + `B`

# Addons
## Code Structure
(Taken from `addons/example.js`)
```js
// INSTALL: /
exports.enabled = false;

// Addon
const sleep = ms => new Promise(r => setTimeout(r, ms));

exports.preBuild = async function() {
  await sleep(1000);
}

exports.postBuild = async function() {
  await sleep(1000);
}
```

* First line should be a comment listing the required Node-Modules, if none is required, then put a slash. Examples:
  * `// INSTALL: /`
  * `// INSTALL: npm i archiver`
* Second line should be if the module is enabled or not and by default should always be:
  * `exports.enabled = false;`
* Third line should be blank.
* Fourth line should be a comment (`// Addon`)
* And then you are free to code.
  * Make an `async function` at `exports.preBuild` to make a Pre-Build execution process.
  * Make an `async function` at `exports.postBuild` to make a Post-Build execution process.

## List of Addons
* Example
  * This addon just serves as an example.
  * Made by [@neptnium](https://github.com/neptnium)

---

# Contributing
* We encourage you to contribute if you want to.
* You can:
  * Add improvements to the main buildier itself.
  * Add new addons. *By default an addon must be disabled (`exports.enabled = false;`)*
  * Add improvements to addons.
  * **DO NOT ADD NODE MODULES FOR ADDONS TO THE REPOSITORY, USERS WILL INSALED REQUIRED MODULES IF NEEDED**