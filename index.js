#!/usr/bin/env node

'use strict';

const { cli } = require('./lib/cli');

cli(process.argv.slice(1));
