const defaultLint = require('eslint-config/src/index.ts');

defaultLint.rules['node/no-missing-import'] = 'off';

module.exports = defaultLint;
