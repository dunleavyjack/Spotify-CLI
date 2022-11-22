import { SpotifyHeader } from '../types';

// TODO: Remove hardcoded sample authtoken.
const authToken = process.env.SAMPLE_AUTH_TOKEN;

export const spotifyHeader: SpotifyHeader = {
    headers: {
        Authorization: `Bearer ${authToken}`,
    },
};
