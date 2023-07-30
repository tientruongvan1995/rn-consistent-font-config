# Guide to use consistent Font Typeface in React Native

## Goal

Because Android must use exact font name, while iOS can do already.

Try to use font typeface modifiers such as `fontWeight` and `fontStyle` in combination with a custom font family, make developers have better experience when using font styles on both iOS and Android.

Must be

```jsx
<>
    <Text style={{
      fontFamily: "Poppins",
      fontWeight: "100",
      style: "italic"
    }}>
      Hello world!
    </Text>
    <Text style={{
      fontFamily: "Poppins",
      fontWeight: "bold",
      style: "normal"
    }}>
      Hello world!
    </Text>
</>
```

instead of do this on Android

```jsx
<>
    <Text style={{ fontFamily: "Poppins-ThinItalic" }}>
      Hello world!
    </Text>
    <Text style={{ fontFamily: "Poppins-Bold" }}>
      Hello world!
    </Text>
</>
```

For this example, we are going to register the _Poppins_ font family. Of course, this method will work with any TTF font.

## Prerequisites

### Assets

You need the [whole Poppins font family](https://fonts.google.com/share?selection.family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900), extracted in a `assets/fonts` folder. That is:

- `Poppins-Thin.ttf` (100)
- `Poppins-ThinItalic.ttf`
- `Poppins-ExtraLight.ttf` (200)
- `Poppins-ExtraLightItalic.ttf`
- `Poppins-Light.ttf` (300)
- `Poppins-LightItalic.ttf`
- `Poppins-Regular.ttf` (400)
- `Poppins-Italic.ttf`
- `Poppins-Medium.ttf` (500)
- `Poppins-MediumItalic.ttf`
- `Poppins-SemiBold.ttf` (600)
- `Poppins-SemiBoldItalic.ttf`
- `Poppins-Bold.ttf` (700)
- `Poppins-BoldItalic.ttf`
- `Poppins-ExtraBold.ttf` (800)
- `Poppins-ExtraBoldItalic.ttf`
- `Poppins-Black.ttf` (900)
- `Poppins-BlackItalic.ttf`

if the file name doesn't follow to this standard, make sure to rename them.

### Find the font family name

> You will need **otfinfo** installed in your system to perform this step.
> It is shipped with many Linux distributions.
> On MacOS, install it via **lcdf-typetools** brew package.

```sh
otfinfo --family Poppins-Regular.ttf
```

It should print "Poppins". This value must be retained for the Android setup.
This name will be used in React `fontFamily` style, and it needs to be registered in [font.json](./font.json)

## Setup

### 1. Init project or go to existed project

```sh
  react-native init <ProjectName>
  cd <ProjectName>
```

### 2. Make sure your project has necessary files

- [Fonts in assets/fonts](./assets/fonts)
- [Script file](./scripts/registerFontFamilyAndroid.ts)
- ["Real" font names in font.json](./font.json)

### 3. Add asset to `react-native.config.js`

```js
module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
};
```

### 4. Link asset

```sh
# react-native >= 0.69
npx react-native-asset 

# otherwise
react-native link
```

### 5. iOS

On iOS, things will get much easier. We will basically just need to use React Native asset link functionality. This method requires that we use the font family name retrieved in the first step as fontFamily style attribute. Make sure fonts would be register by checking:

- project.pbxproj
- link-assets-manifest.json

### 6. Android

The main reason we need to do all of this.

For Android, we are going to use [XML Fonts](https://developer.android.com/guide/topics/ui/look-and-feel/fonts-in-xml) to define variants of a base font family.

> **Remark**: This procedure is available in React Native since commit [fd6386a07eb75a8ec16b1384a3e5827dea520b64](https://github.com/facebook/react-native/commit/fd6386a07eb75a8ec16b1384a3e5827dea520b64) (7 May 2019 ), with the addition of `ReactFontManager::addCustomFont` method.

**TODO:** I already make script for those actions, make sure step [2] correct and just run:

```bash
  npx ts-node ./scripts/registerFontFamilyAndroid.ts
```

The script will register your fonts by creating font family and register custom font in MainApplication

Changes

- `android/app/src/main/assets/fonts`
- `MainApplication.java`

### 7. Run app

Yeah finally, just write some demo code and run app to experience

**Note:** need using other fonts, just download and move them to assets/fonts, then register real font name in font.json, then make the step again.
