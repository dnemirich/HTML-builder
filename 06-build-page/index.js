const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const outputFolder = path.join(__dirname, 'project-dist');
const outputPage = path.join(outputFolder, 'index.html');
const outputStyles = path.join(outputFolder, 'style.css');
const outputAssets = path.join(outputFolder, 'assets');

const templateFile = path.join(__dirname, 'template.html');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const assetsFolder = path.join(__dirname, 'assets');

async function htmlAssembly() {
  try {
    await fsPromises.mkdir(outputFolder, { recursive: true });
    const output = fs.createWriteStream(outputPage);
    await createBundle(stylesFolder, outputStyles);
    await copyDir(assetsFolder, outputAssets);

    let template = await fsPromises.readFile(templateFile, {
      encoding: 'utf-8',
    });

    const components = await fsPromises.readdir(componentsFolder);
    for (const component of components) {
      const name = `{{${path.basename(component, '.html')}}}`;
      const content = await fsPromises.readFile(
        path.join(componentsFolder, component),
        {
          encoding: 'utf-8',
        },
      );
      template = template.replace(name, content);
    }

    output.write(template);
  } catch (error) {
    console.log(`Error during html building: ${error}`);
  }
}

async function copyDir(source, destination) {
  try {
    await fsPromises.mkdir(destination, { recursive: true });
    const sourceContent = await fsPromises.readdir(source, {
      withFileTypes: true,
    });
    const destinationContent = await fsPromises.readdir(destination, {
      withFileTypes: true,
    });
    const names = new Set(destinationContent.map((item) => item.name));

    for (const item of sourceContent) {
      const sPath = path.join(source, item.name);
      const dPath = path.join(destination, item.name);

      if (item.isDirectory()) {
        await copyDir(sPath, dPath);
      } else if (item.isFile()) {
        if (!names.has(item.name)) {
          await fsPromises.copyFile(sPath, dPath);
        }
      }
    }

    for (const item of destinationContent) {
      if (!sourceContent.some((sItem) => item.name === sItem.name)) {
        const path = path.join(destination, item.name);
        if (item.isFile()) {
          await fsPromises.unlink(path);
        } else {
          await fsPromises.rm(path, { force: true, recursive: true });
        }
      }
    }
  } catch (err) {
    console.log(`Error copying the directory: ${err}`);
  }
}

async function createBundle(sourceDir, outputFile) {
  try {
    const files = await fsPromises.readdir(sourceDir, {
      withFileTypes: true,
    });
    const cssFiles = files.filter(
      (file) => file.isFile() && path.extname(file.name) === '.css',
    );
    let res = '';
    for (const css of cssFiles) {
      res +=
        (await fsPromises.readFile(path.join(sourceDir, css.name), 'utf-8')) +
        '\n';
    }
    await fsPromises.writeFile(outputFile, res);
  } catch (error) {
    console.log(`Error creating bundle: ${error}`);
  }
}

htmlAssembly();
