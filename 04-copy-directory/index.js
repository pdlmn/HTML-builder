const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const copyDir = (files) => {
  if (!files.includes('files-copy')) {
    fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
      if (err) throw err;
    });
  }
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    files.forEach(file => {
      fs.copyFile(path.join(__dirname, 'files', file), path.join(__dirname, 'files-copy', file), (err) => {
        if (err) throw err;
      });
    });
  });
};

const init = () => {
  fs.readdir(__dirname, (err, files) => {
    emitter.emit('filesLoaded', files);
  });

  emitter.on('filesLoaded', copyDir);
};

init();
