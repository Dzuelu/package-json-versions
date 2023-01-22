const defaultLint = require('eslint-config/src/index.ts');

defaultLint.rules['node/no-missing-import'] = 'off';
defaultLint.rules['no-empty'] = 'off';

module.exports = defaultLint;
