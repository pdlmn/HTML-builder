const path = require('path');
const fs = require('fs/promises');

const stylesDir = path.join(__dirname, 'styles');

const makeBundle = async () => {
  const files = await fs.readdir(stylesDir);
  let content = '';
  for (let file of files) {
    if (path.extname(file) !== '.css') {
      continue;
    }
    content += await fs.readFile(path.join(stylesDir, file));
    content += '\n';
  }
  content = content.trim();
  fs.writeFile(path.join(__dirname, 'project-dist','bundle.css'), content);
};

makeBundle();
