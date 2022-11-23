import { SpotifyHeader } from '../types';
const authToken = process.env.SAMPLE_AUTH_TOKEN; // Todo: Replace sample auth token with real one

export const spotifyHeader: SpotifyHeader = {
    headers: {
        Authorization: `Bearer ${authToken}`,
    },
};
