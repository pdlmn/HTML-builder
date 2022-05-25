const path = require('path');
const fs = require('fs');
const EventEmitter = require('events');
const emitter = new EventEmitter();

const cleanDir = () => {
  fs.rm(
    path.join(__dirname, 'files-copy'),
    { force: true, recursive: true },
    (err) => {
      if (err) console.log(err);
      fs.mkdir(path.join(__dirname, 'files-copy'), (err) => {
        if (err) throw err;
        emitter.emit('directoryCreated');
      });
    });
};

const copyDir = () => {
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
    cleanDir();
  });

  emitter.on('directoryCreated', copyDir);
};

init();
