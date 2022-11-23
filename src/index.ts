#! /usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import { back, next, now, test } from './commands/commands';

const program = new Command();

program
    .version('1.0.0')
    .description('A tool for controlling Spotify from the command line.');

program
    .command('now')
    .description('Get the currently playing song')
    .action(now);

program
    .command('next')
    .description('Skip to next available song in the queue')
    .action(next);

program
    .command('back')
    .description('Replay current song or go back')
    .action(back);

program.command('test').description('For dev purposes').action(test);

program.parse(process.argv);
