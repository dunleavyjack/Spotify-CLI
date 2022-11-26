#! /usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import { back, login, next, now } from './commands/commands';

const program = new Command();

program
    .version('1.0.0')
    .description('A tool for controlling Spotify from the command line.');

program.command('login').description('Login with Spotify OAuth2').action(login);

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

program.parse(process.argv);
