import axios, { AxiosError, AxiosResponse } from 'axios';
import { CurrentSongResponse } from '../types';
import { spotifyHeader } from './spotifyUtils';

export const getCurrentlyPlayingSong =
    async (): Promise<CurrentSongResponse> => {
        try {
            const response: AxiosResponse =
                await axios.get<SpotifyApi.CurrentPlaybackResponse>(
                    'https://api.spotify.com/v1/me/player/currently-playing',
                    spotifyHeader
                );

            const { data: songData, status } = response;
            const { name, artists, album } = songData;

            const albumName = album.name;
            const artist = artists
                .map((_artist: any) => _artist.name)
                .join(', ');

            console.log('OKAY');
            return {
                name,
                artist,
                albumName,
                status,
            };
        } catch (error) {
            let status: number;
            if (axios.isAxiosError(error) && error.response) {
                status = error.response.status;
            } else {
                status = -1;
            }

            return {
                name: '',
                artist: '',
                albumName: '',
                status,
            };
        }
    };
