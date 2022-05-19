const path = require('path');
const fs = require('fs/promises');
const { copyFile } = require('fs');
const { dirname } = require('path/posix');

const TEMPLATE_PATH = path.join(__dirname, 'template.html');
const COMPONENTS_DIR = path.join(__dirname, 'components');
const STYLES_DIR = path.join(__dirname, 'styles');
const ASSETS_DIR = path.join(__dirname, 'assets');
const OUTPUT_DIR = 'project-dist';

const replacePlaceholders = (str, data) => {
  return str.replace(/{{(.*?)}}/g, (placeholder) => {
    const placeholderName = placeholder.replace(/{{|}}/g, '');
    return data[placeholderName]
      ? data[placeholderName]
      : placeholder;
  });
};

const parseHTML = async (template, dir) => {
  const content = (await fs.readFile(template)).toString().trim();
  const components = await fs.readdir(dir);

  let data = {};
  for (let component of components) {
    const componentContent = await fs.readFile(
      path.join(dir, component),
      'utf8'
    );
    data[path.basename(component, '.html')] = componentContent;
  }

  const parsed = replacePlaceholders(content, data);
  return parsed;
};

const bundleCSS = async (stylesDir) => {
  const cssFiles = await fs.readdir(stylesDir);

  let bundle = '';
  for (let css of cssFiles) {
    const content = (await fs.readFile(path.join(stylesDir, css))).toString();
    bundle += content;
  }

  return bundle;
};

const copyFolder = async (srcDir, destDir) => {
  const assetFiles = await fs.readdir(srcDir, { 'withFileTypes': true });
  const outputDir = await fs.readdir(path.join(__dirname, OUTPUT_DIR))
  const dirName = destDir.split('/').at(-1)

  if (!outputDir.includes(dirName)) {
    await fs.mkdir(destDir)
  }

  for (let file of assetFiles) {
    if (file.isDirectory()) {
      copyFolder(path.join(srcDir, file.name), path.join(destDir, file.name))
    } else {
      fs.copyFile(path.join(srcDir, file.name), path.join(destDir, file.name))
    }
  }

};

const build = async (destination) => {
  const files = await fs.readdir(__dirname);

  if (!files.includes(destination)) {
    await fs.mkdir(path.join(__dirname, destination));
  }

  const parsedHTML = await parseHTML(TEMPLATE_PATH, COMPONENTS_DIR);
  const bundledCSS = await bundleCSS(STYLES_DIR);
  fs.writeFile(path.join(__dirname, destination, 'index.html'), parsedHTML);
  fs.writeFile(path.join(__dirname, destination, 'style.css'), bundledCSS);
  copyFolder(ASSETS_DIR, path.join(__dirname, destination, 'assets'))
};

build(OUTPUT_DIR);
