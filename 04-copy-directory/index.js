const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const cleanDir = (files) => {
  if (!files.includes('files-copy')) {
    fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
      if (err) throw err;
    });
  } else {
    fs.readdir(path.join(__dirname, 'files-copy'), (err, files) => {
      files.forEach(file => {
        fs.unlink(path.join(__dirname, 'files-copy', file), (err) => {
          if (err) {
            console.log(err);
          }
        });
      });
    });
  }
};

const copyDir = (files) => {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    files.forEach(file => {
      fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
        if (err) throw err;
      });
    });
    console.log('Файлы успешно скопированы!');
  });
};

const init = () => {
  fs.readdir(__dirname, (err, files) => {
    emitter.emit('filesLoaded', files);
  });

  emitter.on('filesLoaded', (files) => {
    cleanDir(files);
    emitter.emit('directoryCreated', files);
  });

  emitter.on('filesLoaded', copyDir);
};

init();
