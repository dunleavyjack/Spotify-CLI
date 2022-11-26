import axios, { AxiosResponse } from 'axios';
import open from 'open';
import express from 'express';
import chalk from 'chalk';
import Configstore from 'configstore';
import { IncomingMessage, Server, ServerResponse } from 'http';
import {
    spotifyAuthURL,
    spotifyHeader,
    spotifyHeaderTwo,
} from '../api/spotifyUtils';

const config = new Configstore('spotify-cli');
const { SPOTIFY_BASE_URL, REDIRECT_URL, PORT } = process.env;

// Login
export const login = async () => {
    const app = express();

    let resolve: any;
    const authCodePromise: Promise<string> = new Promise((_resolve) => {
        resolve = _resolve;
    });

    app.get('/redirect', (req, res) => {
        resolve(req.query.code);
        // Close window/tab and server
        res.send('<script>window.close();</script > ');
        res.end('');
    });

    const server: Server<typeof IncomingMessage, typeof ServerResponse> =
        app.listen(PORT);
    open(spotifyAuthURL);

    const code: string = await authCodePromise;

    const res = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: {
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URL,
        },
        headers: spotifyHeaderTwo,
    });

    const token = res.data['access_token'];
    server.close();

    console.log('Logged in successfully with token ' + token);
    process.exit(0);
};

// Get current song
export const now = async (): Promise<void> => {
    try {
        const response: AxiosResponse =
            await axios.get<SpotifyApi.CurrentPlaybackResponse>(
                `${SPOTIFY_BASE_URL}/currently-playing`,
                spotifyHeader
            );
        const {
            data: { item: currentSong },
        } = response;
        const { album, artists, name } = currentSong;

        console.log(chalk.green(name));
        console.log(
            chalk.green.dim(
                artists.map((_artist: any) => _artist.name).join(', ')
            )
        );
        console.log(chalk.green.dim(album.name));
    } catch (error) {
        console.log('auth error');
    }
};

// Skip to next song
export const next = async (): Promise<void> => {
    try {
        axios.post(`${SPOTIFY_BASE_URL}/next`, spotifyHeader);
    } catch (error) {
        console.log('error');
    }
};

// Replay current song or go back
export const back = async (): Promise<void> => {
    try {
        axios.post(`${SPOTIFY_BASE_URL}/previous`, spotifyHeader);
    } catch (error) {
        console.log('error');
    }
};
