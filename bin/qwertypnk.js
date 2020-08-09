#!/usr/bin/env node

const path = require('path');
const { execSync } = require('child_process');
const fs = require('fs-extra');

const options = process.argv.slice(2);

const modulePath = path.resolve(path.dirname(require.resolve('../package.json')));

const packageTemplatePath = path.resolve(modulePath, 'templates', 'package');
const defpackageTemplatePath = path.resolve(modulePath, 'templates', 'defpackage');
const spackageTemplatePath = path.resolve(modulePath, 'templates', 'spackage');

// const boilerplateTemplatePath = path.resolve(modulePath, 'templates', 'boilerplate');

const packageJson = JSON.parse(fs.readFileSync(path.resolve(require.resolve('../package.json'))).toString());

const helpDisplay = () => {
  console.log(`hello, available commands:
    qwerty version
    qwerty help
    qwerty package [package-name]
    qwerty boilerplate [app-name] [app-package-name]
  `);
};
const helpDisrupt = (options) => {
  if (!(options instanceof Array)) {
    return null;
  }
  for (let option of options) {
    if ([ '-h', '--help' ].indexOf(option.toLowerCase()) !== -1) {
      return helpDisplay;
    }
  }
  return null;
};

let disrupt;
let packageName;
let packagePath;
let packageFolderName;
// let appName;
// let appPackageName;
// let appDomain;
// let appPath;
// let appInfo;

if (!options.length) {
  console.log('Error: no options.');
  process.exit(1);
}

switch (options[ 0 ].toLowerCase()) {
  case 'version':
  case 'v':
  case '-v':
  case '--version':
    disrupt = helpDisrupt(options);
    if (disrupt) {
      return disrupt();
    }

    console.log(packageJson.version);

    break;

  case 'help':
  case 'h':
  case '-h':
  case '--help':
    console.log(`hello, available commands:
      qwerty version
      qwerty help
      qwerty package [package-name]
      qwerty boilerplate [app-name] [app-package-name]
    `);

    break;

  case 'package':
    disrupt = helpDisrupt(options);
    if (disrupt) {
      return disrupt();
    }

    exit(!options[ 1 ], 'Error: no package name option.');
    exit(options.length > 2, 'Error: unknown extra options.');

    packageName = options[ 1 ];
    packageFolderName = packageName;
    try {
      if (packageName.charAt(0) === '@' && packageName.search('/')) {
        packageFolderName = packageName.split('/')[ 1 ];
      }
    } catch (ex) {
      console.warn(ex);
    }
    packagePath = path.resolve(process.cwd(), packageFolderName);

    exit(
      fs.existsSync(path.resolve(process.cwd(), packageFolderName)),
      'Error: a folder with the package name already exists.',
    );

    fs.copySync(packageTemplatePath, packagePath);
    replaceInFile(path.resolve(packagePath, 'package.json'), {
      'package-name': packageName,
    });
    execSync('npm install --no-package-lock', { cwd: packageFolderName });
    execSync('npx tsc', { cwd: packageFolderName });

    break;

  case 'defpackage':
    disrupt = helpDisrupt(options);
    if (disrupt) {
      return disrupt();
    }

    exit(!options[ 1 ], 'Error: no package name option.');
    exit(options.length > 2, 'Error: unknown extra options.');

    packageName = options[ 1 ];
    packageFolderName = packageName;
    try {
      if (packageName.charAt(0) === '@' && packageName.search('/')) {
        packageFolderName = packageName.split('/')[ 1 ];
      }
    } catch (ex) {
      console.warn(ex);
    }
    packagePath = path.resolve(process.cwd(), packageFolderName);

    exit(
      fs.existsSync(path.resolve(process.cwd(), packageFolderName)),
      'Error: a folder with the package name already exists.',
    );

    fs.copySync(defpackageTemplatePath, packagePath);
    replaceInFile(path.resolve(packagePath, 'package.json'), {
      'package-name': packageName,
    });

    break;

  case 'spackage':
    disrupt = helpDisrupt(options);
    if (disrupt) {
      return disrupt();
    }

    exit(!options[ 1 ], 'Error: no package name option.');
    exit(options.length > 2, 'Error: unknown extra options.');

    packageName = options[ 1 ];
    packageFolderName = packageName;
    try {
      if (packageName.charAt(0) === '@' && packageName.search('/')) {
        packageFolderName = packageName.split('/')[ 1 ];
      }
    } catch (ex) {
      console.warn(ex);
    }
    packagePath = path.resolve(process.cwd(), packageFolderName);

    exit(
      fs.existsSync(path.resolve(process.cwd(), packageFolderName)),
      'Error: a folder with the package name already exists.',
    );

    fs.copySync(spackageTemplatePath, packagePath);
    replaceInFile(path.resolve(packagePath, 'package.json'), {
      'package-name': packageName,
    });

    break;

  case 'boilerplate':
    console.log('disabled for now.');

    // disrupt = helpDisrupt(options);
    // if (disrupt) {
    //   return disrupt();
    // }

    // exit(!options[1], 'Error: no app name option.');
    // exit(!options[2], 'Error: no app package name option.');
    // exit(!options[3], 'Error: no app domain option.');
    // exit(options.length > 4, 'Error: unknown extra options.');

    // appName = options[1];
    // appPackageName = options[2];
    // appDomain = options[3];
    // appPath = path.resolve(process.cwd(), appName);

    // if (!fs.existsSync(appPath)) {
    //   fs.mkdirSync(appPath, { recursive: true });
    // }

    // fs.readdirSync(appPath).map((file) => {
    //   exit(file.charAt(0) !== '.', 'Error: cannot setup boilerplate, folder is not empty.');
    // });

    // // packages
    // execSync('git clone git://github.com/qwertypnk/packages packages', { cwd: appPath });
    // // ?? how do we upgrade / downgrade to different versions? or de we simply renounce any kind of versioning?
    // // fs.removeSync(path.resolve('packages', '.git'), {recursive: true});

    // // public
    // fs.copySync(path.resolve(boilerplateTemplatePath, 'public'), path.resolve(appPath, 'public'), { recursive: true });

    // // .gitignore
    // fs.copySync(path.resolve(boilerplateTemplatePath, 'file-gitignore'), path.resolve(appPath, '.gitignore'));

    // // app info
    // appInfo = {
    //   name: appName,
    //   packageName: appPackageName,
    //   domain: appDomain,
    //   apiUrl: 'https://[app-domain]/api',
    //   clientUrl: 'https://[app-domain]',
    //   apiPort: 3000,
    //   clientPort: 8080,
    //   sockHost: '[app-domain]',
    //   translationsUrl: null,
    //   privacyPolicyUrl: 'https://www.dummies.com/privacy-policy',
    //   termsOfUseUrl: 'https://www.termsandcondiitionssample.com',
    // };
    // fs.writeFileSync(path.resolve(appPath, 'info.json'), JSON.stringify(appInfo, null, 2));
    // replaceInFile(path.resolve(appPath, 'info.json'), {
    //   '[app-domain]': appDomain,
    // });

    // // dev notes
    // fs.copyFileSync(path.resolve(boilerplateTemplatePath, 'devnotes.txt'), path.resolve(appPath, 'devnotes.txt'));

    // // certs (todo)
    // fs.mkdirSync(path.resolve(appPath, 'certs'));

    // // proxy
    // fs.copySync(path.resolve(boilerplateTemplatePath, 'proxy'), path.resolve(appPath, 'proxy'), { recursive: true });
    // execSync('npm install', { cwd: path.resolve(appPath, 'proxy') });

    // // client
    // fs.copySync(path.resolve(boilerplateTemplatePath, 'client'), path.resolve(appPath, 'client'), { recursive: true });
    // execSync('npm install', { cwd: path.resolve(appPath, 'client') });

    // // api
    // fs.copySync(path.resolve(boilerplateTemplatePath, 'api'), path.resolve(appPath, 'api'), { recursive: true });
    // execSync('npm install', { cwd: path.resolve(appPath, 'api') });

    break;

  default:
    disrupt = helpDisrupt(options);
    if (disrupt) {
      return disrupt();
    }

    console.log('Unknown command.');
}

//

async function replaceInFile(path, replacements) {
  let data = fs.readFileSync(path).toString();
  for (let [ key, value ] of Object.entries(replacements)) {
    data = data.replace(key, value);
  }
  fs.writeFileSync(path, data);
}

function exit(condition, message = 'Error: bad command.', exitCode = 1) {
  if (!condition) {
    return;
  }
  console.log(message);
  process.exit(exitCode);
}
