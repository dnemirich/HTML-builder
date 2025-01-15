const path = require('path');
const { stdout } = process;
const fsPromises = require('fs/promises');
const folder = path.join(__dirname, 'secret-folder');

async function listFiles() {
  try {
    const files = await fsPromises.readdir(folder, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        const ext = path.extname(file.name).replace('.', '');
        const name = path.basename(file.name, `.${ext}`);

        const stats = await fsPromises.stat(path.join(folder, file.name));
        const size = stats.size / 1024;

        stdout.write(`${name} - ${ext} - ${size}kb\n`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

listFiles();
