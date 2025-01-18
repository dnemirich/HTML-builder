const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), {
  flags: 'a',
  autoClose: false,
});

stdout.write('Enter your text:\n');
stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'exit') {
    exit();
  }
  output.write(data, () => {
    output.emit('drain');
  });
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('Goodbye!\n'));
