import { SpotifyHeader } from '../types';
import { SpotifyAccessToken } from '../types';

const {
    DEV_AUTH_TOKEN,
    SPOTIFY_AUTH_URL,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_SCOPES,
    REDIRECT_URL,
    SPOTIFY_CLIENT_SECRET,
} = process.env;

export const spotifyHeader: SpotifyHeader = {
    headers: {
        Authorization: `Bearer ${DEV_AUTH_TOKEN}`,
    },
};

export const spotifyHeaderTwo: any = {
    Authorization:
        'Basic ' +
        Buffer.from(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET).toString(
            'base64'
        ), // TODO: Remove deprecated Buffer instance
    'Content-Type': 'application/x-www-form-urlencoded',
};

export const spotifyAuthURL = `${SPOTIFY_AUTH_URL}?client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(
    SPOTIFY_SCOPES || ''
)}&redirect_uri=${encodeURIComponent(
    REDIRECT_URL || ''
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
