export type SpotifyAuthorization = {
    Authorization: string;
};

export type SpotifyHeader = {
    headers: SpotifyAuthorization;
};

export type CurrentSongResponse = {
    name: string;
    artist: string;
    albumName: string;
    status: number;
};
