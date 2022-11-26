import Conf from 'conf/dist/source';
import axios, { AxiosResponse } from 'axios';
import open from 'open';
import express from 'express';
import chalk from 'chalk';
import { IncomingMessage, Server, ServerResponse } from 'http';
import {
    spotifyAuthURL,
    spotifyGetHeader,
    spotifyPlaybackControlHeader,
    spotifyPostHeader,
} from '../api/spotifyUtils';
import { AUTHORIZATION_CODE } from '../constants';

const { SPOTIFY_BASE_URL, SPOTIFY_REDIRECT_URL, PORT } = process.env;
const config = new Conf();

// Login
export const login = async () => {
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

    const res = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
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

    console.log('Logged in successfully with token ' + accessToken);
    process.exit(0);
};

// Get current song
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

        console.log('Song: ' + chalk.green(name));
        console.log(
            'Artist: ' +
                chalk.green.dim(
                    artists.map((_artist: any) => _artist.name).join(', ')
                )
        );
        console.log('Album: ' + chalk.green.dim(album.name));
    } catch (error) {
        console.log('auth error');
    }
};

// Pause the current song
export const pause = async () => {
    try {
        axios.put(
            `${SPOTIFY_BASE_URL}/pause`,
            null,
            spotifyPlaybackControlHeader
        );
    } catch (error) {
        console.log('error');
    }
};

// Resume playback on current song
export const play = async () => {
    try {
        axios.put(
            `${SPOTIFY_BASE_URL}/play`,
            null,
            spotifyPlaybackControlHeader
        );
    } catch (error) {
        console.log('error');
    }
};

// Skip to next song
export const next = async (): Promise<void> => {
    try {
        axios.post(
            `${SPOTIFY_BASE_URL}/next`,
            null,
            spotifyPlaybackControlHeader
        );
    } catch (error) {
        console.log('error');
    }
};

// Replay current song or go back
export const back = async (): Promise<void> => {
    try {
        axios.post(
            `${SPOTIFY_BASE_URL}/previous`,
            null,
            spotifyPlaybackControlHeader
        );
    } catch (error) {
        console.log('error');
    }
};
