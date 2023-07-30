// eslint-disable-next-line import/no-extraneous-dependencies
import glob from 'glob';

import fs from 'fs';
import path from 'path';

import { font as registeredFonts } from '../font.json';

const rootDir = path.join(__dirname, '/..');

const androidDir = path.join(rootDir, '/android');

const androidFontDir = path.join(androidDir, '/app/src/main/res/font');

const androidMainDir = path.join(androidDir, '/app/src/main/java');

const androidAssetFontDir = path.join(androidDir, '/app/src/main/assets/fonts');

function getFontWeight(fileName: string) {
  switch (true) {
    case fileName.includes('thin'):
      return '100';
    case fileName.includes('extralight'):
      return '200';
    case fileName.includes('light'):
      return '300';
    case fileName.includes('regular'):
      return '400';
    case fileName.includes('medium'):
      return '500';
    case fileName.includes('semibold'):
      return '600';
    case fileName.includes('extrabold'):
      return '800';
    case fileName.includes('bold'):
      return '700';
    case fileName.includes('black'):
      return '900';
  }
  return '400';
}

// -------------------------- GENERATE FONTS FAMILY TO ANDROID --------------------------

function prepareFontXml(rawFont: string, files: string[]) {
  console.log('* [Font] prepareFontXml', rawFont);

  if (!files || !files.length) {
    return;
  }

  const font = rawFont.toLowerCase();

  const isExisted = fs.existsSync(`${androidFontDir}/${font}.xml`);

  if (isExisted) {
    console.log(`* [Font] ${font}.xml is existed`);
    return;
  }

  let xmlContent = `<?xml version="1.0" encoding="utf-8"?>
<font-family xmlns:app="http://schemas.android.com/apk/res-auto">`;

  for (const file of files) {
    if (file.includes(rawFont)) {
      const [fontName] = file.toLowerCase().replace('-', '_').split('.');

      const fontStyle = fontName.includes('italic') ? 'italic' : 'normal';

      const fontWeight = getFontWeight(fontName);

      const line = `\t<font app:fontStyle="${fontStyle}" app:fontWeight="${fontWeight}" app:font="@font/${fontName}"/>`;

      xmlContent = xmlContent + '\n' + line;
    }
  }

  xmlContent = xmlContent + '\n' + '</font-family>';

  fs.writeFileSync(`${androidFontDir}/${font}.xml`, xmlContent);

  console.log(`* [Font] ${font}.xml is generated`);
}

// --------------------------------------------------------------------------

function addFontToMainApplication(rawFontName: string) {
  const fontName = rawFontName.toLowerCase();

  const mainAppPath = `${androidMainDir}/**/MainApplication.java`;

  glob(mainAppPath, function (err: any, files: any[]) {
    if (err) {
      return console.error(err);
    }

    const mainAppFile = files[0] as any;

    const data = fs.readFileSync(mainAppFile, 'utf8');

    let content = data;

    const addLine = `ReactFontManager.getInstance().addCustomFont(this, "${rawFontName}", R.font.${fontName});`;

    if (!content.includes(addLine)) {
      console.log('* [Font] Add code', addLine);

      content = content.replace(
        'super.onCreate();',
        `super.onCreate();\n    ${addLine}`,
      );
    } else {
      console.log(
        `* [Font] [${rawFontName}] is already exist in MainApplication.java`,
      );
      return;
    }

    const importLine = 'import com.facebook.react.views.text.ReactFontManager;';

    if (!content.includes(importLine)) {
      console.log('* [Font] Import', importLine);

      content = content.replace(
        'import com.facebook.react.ReactApplication;',
        `import com.facebook.react.ReactApplication;\n${importLine}`,
      );
    }

    fs.writeFileSync(mainAppFile, content, 'utf8');

    console.log(
      `* [Font] [${rawFontName}] is registered to MainApplication.java`,
    );
  });
}

// --------------------------------------------------------------------------
function convertToFontFamily(font: string) {
  console.log('* [Font] convertToFontFamily - font:', font);

  const files = fs.readdirSync(androidAssetFontDir);

  if (!fs.existsSync(androidFontDir)) {
    fs.mkdirSync(androidFontDir);
  }

  for (const file of files) {
    if (file.includes(font)) {
      const fontName = file.toLowerCase().replace('-', '_');

      fs.copyFileSync(
        `${androidAssetFontDir}/${file}`,
        `${androidFontDir}/${fontName}`,
      );
    }
  }

  prepareFontXml(font, files);

  addFontToMainApplication(font);
}

// -------------------------- EXECUTE --------------------------

function execute() {
  for (const font of registeredFonts) {
    convertToFontFamily(font);
  }
}

execute();
