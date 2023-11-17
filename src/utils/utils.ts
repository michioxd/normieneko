export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function isValidUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

export function isYouTubeWatchUrl(url: string) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)\S{11}$/;
    return youtubeRegex.test(url);
}

export function getYouTubeVideoId(url: string) {
    const regex = /[?&]v=([^#&?]{11})/;
    const match = url.match(regex);

    return match ? match[1] : null;
}

export function isYouTubePlaylist(url: string) {
    // Regular expression to match YouTube playlist URLs
    const playlistRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/|youtu\.be\/)playlist(.*)$/;

    return playlistRegex.test(url);
}