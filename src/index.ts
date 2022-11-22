#! /usr/bin/env node

import { Command } from 'commander';
import { now } from './commands/commands';

const program = new Command();

program
    .version('1.0.0')
    .description('A tool for controlling Spotify from the command line.')

    .command('now')
    .description('Get the current;y playing song')
    .action(now)

    .parse(process.argv);
