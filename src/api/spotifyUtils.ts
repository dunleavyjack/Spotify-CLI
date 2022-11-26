import { SpotifyHeader } from '../types';
import { SpotifyAccessToken } from '../types';
import Conf from 'conf/dist/source';
import { ACCESS_TOKEN } from '../constants';

const {
    SPOTIFY_AUTH_URL,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_SCOPES,
    SPOTIFY_REDIRECT_URL,
    SPOTIFY_CLIENT_SECRET,
} = process.env;

export const retrieveAccessToken = () => {
    const config = new Conf();
    return config.get(ACCESS_TOKEN);
};

export const spotifyGetHeader: SpotifyHeader = {
    headers: {
        Authorization: `Bearer ${retrieveAccessToken()}`,
    },
};

export const spotifyPlaybackControlHeader = {
    headers: {
        Authorization: `Bearer ${retrieveAccessToken()}`,
    },
};

export const spotifyPostHeader: any = {
    Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
            'base64'
        ),
    'Content-Type': 'application/x-www-form-urlencoded',
};

export const spotifyAuthURL = `${SPOTIFY_AUTH_URL}?client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(
    SPOTIFY_SCOPES || ''
)}&redirect_uri=${encodeURIComponent(
    SPOTIFY_REDIRECT_URL || ''
)}&response_type=code&show_dialog=true`;

export const getSpotifyAccessToken = (
    spotifyRedirectURL: string
): SpotifyAccessToken => {
    return spotifyRedirectURL
        .slice(1)
        .split('&')
        .reduce((prev: any, curr: string) => {
            const [title, value] = curr.split('=');
            prev[title] = value;
            return prev;
        }, {});
};
