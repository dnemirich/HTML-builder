const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'));

stdout.write('Enter your text:\n');
stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'exit') {
    exit();
  }
  output.write(data);
});

process.on('SIGINT', () => exit());
process.on('exit', () => stdout.write('Goodbye!\n'));
