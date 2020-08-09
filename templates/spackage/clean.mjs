import fs from 'fs';

const dir = fs.readdirSync('./').map((item) => {
  if (
    item.charAt(0) === '.' ||
    ['src', 'node_modules', 'package.json', 'readme.md', 'tsconfig.json', 'clean.mjs'].indexOf(item.toLowerCase()) !==
      -1
  ) {
    return;
  }

  item = `./${item}`;

  fs.rmdirSync(item, { recursive: true });
});
