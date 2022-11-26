export type SpotifyAuthorization = {
    Authorization: string;
};

export type SpotifyHeader = {
    headers: SpotifyAuthorization;
};

export interface SpotifyAccessToken {
    access_token: string;
    token_type: string;
    expires_in: string;
}
