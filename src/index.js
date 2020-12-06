#!/usr/bin/env node
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { commands } = require('./commands');

yargs(hideBin(process.argv))
    .command(commands.start)
    .command(commands.stats)
    .option('n', {
        alias: 'name',
        demandOption: true,
        describe: 'Filename for save logs (without extension)',
        type: 'string'
    })
    .help('h')
    .alias('h', 'help')
    .argv;
