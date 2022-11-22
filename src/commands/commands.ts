import { getCurrentlyPlayingSong } from '../api/spotifyAPI';
import { CurrentSongResponse } from '../types';

export const now = async () => {
    const { name, artist, albumName, status }: CurrentSongResponse =
        await getCurrentlyPlayingSong();
    console.log(name);
    console.log(artist);
    console.log(albumName);
    // if (status !== 200) {
    //     console.log('Sorry. An error occurred.');
    // }
};

// spotify next

// spotify back
