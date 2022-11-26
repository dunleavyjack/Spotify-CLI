#! /usr/bin/env node
import * as dotenv from 'dotenv';
dotenv.config();

import { Command } from 'commander';
import {
    back,
    login,
    next,
    now,
    pause,
    play,
    intro,
    shuffleOff,
    shuffleOn,
} from './commands/commands';

const program = new Command();

program
    .version('1.0.0')
    .description('A tool for controlling Spotify from the command line.')
    .action(intro);

program
    .command('login')
    .description('Login with Spotify OAuth2.')
    .action(login);

program
    .command('now')
    .description('Get the currently playing song.')
    .action(now);

program
    .command('play')
    .description('Resume playback on current song.')
    .action(play);

program
    .command('pause')
    .description('Pause the currently playing song.')
    .action(pause);

program
    .command('next')
    .description('Skip to next available song in the queue.')
    .action(next);

program
    .command('back')
    .description('Replay current song or go back.')
    .action(back);

program
    .command('shuffle-on')
    .description('Toggle shuffle on. If not on already.')
    .action(shuffleOn);

program
    .command('shuffle-off')
    .description('Toggle shuffle off. If not off already.')
    .action(shuffleOff);

program.parse(process.argv);
