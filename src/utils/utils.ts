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

export function getYouTubePlaylistId(url: string) {
    const mainUrl = new URL(url);
    if (mainUrl.hostname.includes("youtube.com") && mainUrl.pathname.startsWith("/playlist")) {
        const playlistId = mainUrl.searchParams.get("list");
        return playlistId && playlistId.length > 0 ? playlistId : "";
    }
    return "";
}


export function getSpotifyPlaylistId(url: string) {
    const mainUrl = new URL(url);
    if (mainUrl.hostname.includes("open.spotify.com") && mainUrl.pathname.startsWith("/playlist/")) {
        const splitUrl = mainUrl.pathname.split("/");
        return splitUrl[2] && splitUrl[2].length > 0 ? splitUrl[2] : "";
    }
    return "";
}

export function getSpotifyTrackId(url: string) {
    const mainUrl = new URL(url);
    if (mainUrl.hostname.includes("open.spotify.com") && mainUrl.pathname.startsWith("/track/")) {
        const splitUrl = mainUrl.pathname.split("/");
        return splitUrl[2] && splitUrl[2].length > 0 ? splitUrl[2] : "";
    }
    return "";
}