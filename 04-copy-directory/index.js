const path = require('path');
const fsPromises = require('fs/promises');
const folder = path.join(__dirname, 'files');
const copy = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    await fsPromises.mkdir(copy, { recursive: true });
    const copyContent = await fsPromises.readdir(copy);
    for (const file of copyContent) {
      await fsPromises.unlink(path.join(copy, file));
    }
    const files = await fsPromises.readdir(folder);
    for (const file of files) {
      await fsPromises.copyFile(path.join(folder, file), path.join(copy, file));
    }
  } catch (err) {
    console.log(err);
  }
}

copyDir();
