import axios, { AxiosResponse } from 'axios';
import chalk from 'chalk';
import { spotifyHeader } from '../api/spotifyUtils';

const { BASE_URL, SAMPLE_AUTH_TOKEN } = process.env;

// Test
export const test = () => {
    console.log('Auth below');
    console.log(SAMPLE_AUTH_TOKEN);
};

// Login
export const login = () => {};

// Get current song
export const now = async (): Promise<void> => {
    try {
        const response: AxiosResponse =
            await axios.get<SpotifyApi.CurrentPlaybackResponse>(
                `${BASE_URL}/currently-playing`,
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
        axios.post(`${BASE_URL}/next`, spotifyHeader);
    } catch (error) {
        console.log('error');
    }
};

// Replay current song or go back
export const back = async (): Promise<void> => {
    try {
        axios.post(`${BASE_URL}/previous`, spotifyHeader);
    } catch (error) {
        console.log('error');
    }
};
