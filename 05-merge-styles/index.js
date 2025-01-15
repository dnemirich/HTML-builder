const fsPromises = require('fs/promises');
const path = require('path');

const outputPath = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputPath, 'bundle.css');
const stylesPath = path.join(__dirname, 'styles');

async function createBundle() {
  try {
    const files = await fsPromises.readdir(stylesPath, {
      withFileTypes: true,
    });
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );
    let res = '';
    for (const css of cssFiles) {
      res +=
        (await fsPromises.readFile(path.join(stylesPath, css.name), 'utf-8')) +
        '\n';
    }
    await fsPromises.writeFile(outputFile, res);
  } catch (error) {
    console.log(error);
  }
}

createBundle();
