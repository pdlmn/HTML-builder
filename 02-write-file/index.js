const path = require('path');
const fs = require('fs');
const EventEmitter = new require('events');
const { stdin, exit } = process;
const emitter = new EventEmitter();

let filesArr;
fs.readdir(path.join(__dirname), (err, files) => {
  if (err) throw err;
  filesArr = files;
  emitter.emit('filesLoaded');
});

emitter.on('filesLoaded', () => {
  if (!filesArr.includes('text.txt')) {
    fs.appendFile(path.join(__dirname, 'text.txt'), '', (err) => {
      if (err) throw err;
      console.log('File was created successfully!');
    });
  }
  console.log('Input data you want add to the file:');
  stdin.on('data', (data) => {
    if (data.toString().trim() === 'exit') {
      console.log('Exitting the programm...');
      exit();
    }
    fs.appendFile(path.join(__dirname, 'text.txt'), data, (err) => {
      if (err) throw err;
    });
  });
});

process.on('SIGINT', () => { 
  console.log('\nExitting the programm...');
  exit();
});
