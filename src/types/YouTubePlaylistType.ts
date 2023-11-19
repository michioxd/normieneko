export interface YouTubePlaylistType {
    type: string;
    title: string;
    playlistId: string;
    playlistThumbnail: string;
    author: string;
    authorId: string;
    authorUrl: string;
    subtitle: null;
    authorThumbnails: YouTubePlaylistThumbnail[];
    description: string;
    descriptionHtml: string;
    videoCount: number;
    viewCount: number;
    updated: number;
    isListed: boolean;
    videos: YouTubePlaylistVideo[];
}

export interface YouTubePlaylistThumbnail {
    url: string;
    width: number;
    height: number;
    quality?: string;
}

export interface YouTubePlaylistVideo {
    title: string;
    videoId: string;
    author: string;
    authorId: string;
    authorUrl: string;
    videoThumbnails: YouTubePlaylistThumbnail[];
    index: number;
    lengthSeconds: number;
}
