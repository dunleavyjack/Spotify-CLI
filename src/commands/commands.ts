import Conf from 'conf/dist/source';
import axios, { AxiosResponse } from 'axios';
import open from 'open';
import express from 'express';
import chalk from 'chalk';
import figlet from 'figlet';
import { AUTHORIZATION_CODE } from '../constants';
import { IncomingMessage, Server, ServerResponse } from 'http';
import {
    spotifyAuthURL,
    spotifyGetHeader,
    spotifyPlaybackControlHeader,
    spotifyPostHeader,
} from '../api/spotifyUtils';

const { SPOTIFY_BASE_URL, SPOTIFY_REDIRECT_URL, SPOTIFY_TOKEN_URL, PORT } =
    process.env;
const config = new Conf();

export const intro = () => {
    console.log(figlet.textSync('Spotify CLI'));
    console.log('                                         ...by Jack');
    console.log('');
    console.log(chalk.grey(' ---- Commands ----'));
    console.log('');
    console.log('login        ' + chalk.grey('Login with Spotify OAuth2.'));
    console.log(
        'now          ' + chalk.grey('Get the currently playing song.')
    );
    console.log(
        'play         ' + chalk.grey('Resume playback on current song.')
    );
    console.log(
        'pause        ' + chalk.grey('Pause the currently playing song.')
    );
    console.log(
        'next         ' +
            chalk.grey('Skip to next available song in the queue.')
    );
    console.log(
        'back         ' + chalk.grey('Replay current song or go back.')
    );
    console.log(
        'shuffle-on   ' + chalk.grey('Toggle shuffle on. If not on already.')
    );
    console.log(
        'shuffle-off  ' + chalk.grey('Toggle shuffle off. If not off already.')
    );
    console.log('');
};

export const login = async () => {
    console.log('One moment. Login should open in your browser.');
    console.log(
        chalk.gray(
            "If your browser doesn't open, make sure you are connected to the internet and that your terminal has the correct permissions enabled."
        )
    );
    const app = express();

    let resolve: any;
    const authorizationCodePromise: Promise<string> = new Promise(
        (_resolve) => {
            resolve = _resolve;
        }
    );

    app.get('/redirect', (req, res) => {
        resolve(req.query.code);
        res.send('<script>window.close();</script > ');
        res.end('');
    });

    const server: Server<typeof IncomingMessage, typeof ServerResponse> =
        app.listen(PORT);
    open(spotifyAuthURL);

    const authorizationCode: string = await authorizationCodePromise;

    console.log('');
    console.log('Talking to Spotify...');
    const res = await axios({
        method: 'post',
        url: SPOTIFY_TOKEN_URL,
        data: {
            grant_type: AUTHORIZATION_CODE,
            code: authorizationCode,
            redirect_uri: SPOTIFY_REDIRECT_URL,
        },
        headers: spotifyPostHeader,
    });

    const accessToken = res.data['access_token'];
    config.set('accessToken', accessToken);
    server.close();

    console.log('');
    console.log("All set! You're logged in with your Spotify account :)");
    console.log('');
    console.log(
        chalk.gray('Hint: Type ') +
            chalk.green.dim('spotify now') +
            chalk.gray(" to see what you're listening to now.")
    );
    console.log('');
    process.exit(0);
};

export const now = async (): Promise<void> => {
    try {
        const response: AxiosResponse =
            await axios.get<SpotifyApi.CurrentPlaybackResponse>(
                `${SPOTIFY_BASE_URL}/currently-playing`,
                spotifyGetHeader
            );
        const {
            data: { item: currentSong },
        } = response;
        const { album, artists, name } = currentSong;

        console.log(figlet.textSync('Now playing...'));
        console.log('');
        console.log('Song:    ' + chalk.green(name));
        console.log(chalk.grey.dim('Album:   ') + chalk.green.dim(album.name));
        console.log(
            chalk.grey.dim('Artist:  ') +
                chalk.green.dim(
                    artists.map((_artist: any) => _artist.name).join(', ')
                )
        );
        console.log('');
    } catch (error) {
        console.log('auth error');
    }
};

export const pause = async () => {
    try {
        await axios.put(
            `${SPOTIFY_BASE_URL}/pause`,
            null,
            spotifyPlaybackControlHeader
        );
        console.log(figlet.textSync('Music paused'));
        console.log('');
        console.log(
            chalk.gray('Try ') +
                'spotify play' +
                chalk.gray(' to jump back in!')
        );
        console.log('');
    } catch (error) {
        console.log('error');
    }
};

export const play = async () => {
    try {
        await axios.put(
            `${SPOTIFY_BASE_URL}/play`,
            null,
            spotifyPlaybackControlHeader
        );
    } catch (error) {
        console.log('error');
    }
    now();
};

export const next = async (): Promise<void> => {
    try {
        await axios.post(
            `${SPOTIFY_BASE_URL}/next`,
            null,
            spotifyPlaybackControlHeader
        );
        now();
    } catch (error) {
        console.log('error');
    }
};

export const back = async (): Promise<void> => {
    try {
        await axios.post(
            `${SPOTIFY_BASE_URL}/previous`,
            null,
            spotifyPlaybackControlHeader
        );
        now();
    } catch (error) {
        console.log('error');
    }
};

export const shuffleOn = async () => {
    try {
        await axios.put(
            `${SPOTIFY_BASE_URL}/shuffle?state=true`,
            null,
            spotifyPlaybackControlHeader
        );
        console.log(figlet.textSync('Shuffle is on'));
    } catch (error) {
        console.log('error');
    }
};

export const shuffleOff = async () => {
    try {
        await axios.put(
            `${SPOTIFY_BASE_URL}/shuffle?state=false`,
            null,
            spotifyPlaybackControlHeader
        );
        console.log(figlet.textSync('Shuffle is off'));
    } catch (error) {
        console.log('error');
    }
};
