#!/usr/bin/env node

'use strict';

const { cli } = require('./lib/cli');

(async () => {
  try {
    await cli(process.argv.slice(1));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
