const path = require('path');
const fs = require('fs');

(async () => {
  const files = await fs.promises.readdir(
    path.join(__dirname, 'secret-folder'),
    { withFileTypes: true }
  );
  files.forEach(file => {
    fs.stat(path.join(__dirname, 'secret-folder', file.name), (err, stats) => {
      if (err) throw err;
      if (file.isDirectory()) return;
      const extension = path.extname(file.name);
      console.log(
        `${path.basename(file.name, extension)} - ${extension.slice(1)} - ${(stats.size / 1000).toLocaleString()}kb`
      );
    });
  });
})();
