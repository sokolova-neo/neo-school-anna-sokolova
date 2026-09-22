const fs = require('fs');
const path = require('path');

// Please note; this is NOT how config cat is set up in the neo codebase; we would be receiving the config json file directly from config cat!!
const writeConfig = () => {
  const config = require('./public/config.default');

  fs.writeFileSync(
    path.resolve(__dirname, '../public/config.json'),
    `${JSON.stringify(config, undefined, 2)}\n`,
  );
};

writeConfig();
