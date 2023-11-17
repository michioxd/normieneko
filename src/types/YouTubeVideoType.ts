// youtube api type
export interface YouTubeAPIType {
    type: string;
    title: string;
    videoId: string;
    videoThumbnails: Thumbnail[];
    storyboards: Storyboard[];
    description: string;
    descriptionHtml: string;
    published: number;
    publishedText: string;
    keywords: string[];
    viewCount: number;
    likeCount: number;
    dislikeCount: number;
    paid: boolean;
    premium: boolean;
    isFamilyFriendly: boolean;
    allowedRegions: string[];
    genre: string;
    genreUrl: string;
    author: string;
    authorId: string;
    authorUrl: string;
    authorVerified: boolean;
    authorThumbnails: Thumbnail[];
    subCountText: string;
    lengthSeconds: number;
    allowRatings: boolean;
    rating: number;
    isListed: boolean;
    liveNow: boolean;
    isUpcoming: boolean;
    dashUrl: string;
    adaptiveFormats: AdaptiveFormat[];
    formatStreams: FormatStream[];
    captions: Caption[];
    recommendedVideos: RecommendedVideo[];
}

export interface AdaptiveFormat {
    init: string;
    index: string;
    bitrate: string;
    url: string;
    itag: string;
    type: string;
    clen: string;
    lmt: string;
    projectionType: ProjectionType;
    fps?: number;
    container?: Container;
    encoding?: string;
    audioQuality?: string;
    audioSampleRate?: number;
    audioChannels?: number;
    resolution?: string;
    qualityLabel?: string;
    colorInfo?: ColorInfo;
}

export interface ColorInfo {
    primaries: Primaries;
    transferCharacteristics: TransferCharacteristics;
    matrixCoefficients: MatrixCoefficients;
}

export enum MatrixCoefficients {
    ColorMatrixCoefficientsBt709 = "COLOR_MATRIX_COEFFICIENTS_BT709",
}

export enum Primaries {
    ColorPrimariesBt709 = "COLOR_PRIMARIES_BT709",
}

export enum TransferCharacteristics {
    ColorTransferCharacteristicsBt709 = "COLOR_TRANSFER_CHARACTERISTICS_BT709",
}

export enum Container {
    M4A = "m4a",
    Mp4 = "mp4",
    Webm = "webm",
}

export enum ProjectionType {
    Rectangular = "RECTANGULAR",
}

export interface Thumbnail {
    url: string;
    width: number;
    height: number;
    quality?: Quality;
}

export enum Quality {
    Default = "default",
    End = "end",
    High = "high",
    Maxres = "maxres",
    Maxresdefault = "maxresdefault",
    Medium = "medium",
    Middle = "middle",
    Sddefault = "sddefault",
    Start = "start",
}

export interface Caption {
    label: string;
    language_code: string;
    url: string;
}

export interface FormatStream {
    url: string;
    itag: string;
    type: string;
    quality: string;
    fps: number;
    container: string;
    encoding: string;
    resolution: string;
    qualityLabel: string;
    size: string;
}

export interface RecommendedVideo {
    videoId: string;
    title: string;
    videoThumbnails: Thumbnail[];
    author: string;
    authorUrl: string;
    authorId: string;
    lengthSeconds: number;
    viewCountText: string;
    viewCount: number;
}

export interface Storyboard {
    url: string;
    templateUrl: string;
    width: number;
    height: number;
    count: number;
    interval: number;
    storyboardWidth: number;
    storyboardHeight: number;
    storyboardCount: number;
}
