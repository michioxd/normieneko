export interface SpotifyPlaylistType {
    collaborative: boolean;
    description: string;
    external_urls: ExternalUrls;
    followers: Followers;
    href: string;
    id: string;
    images: Image[];
    name: string;
    owner: Owner;
    public: boolean;
    snapshot_id: string;
    tracks: Tracks;
    type: string;
    uri: string;
}

export interface ExternalUrls {
    spotify: string;
}

export interface Followers {
    href: string;
    total: number;
}

export interface Image {
    url: string;
    height: number;
    width: number;
}

export interface Owner {
    external_urls: ExternalUrls;
    followers?: Followers;
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name?: string;
    name?: string;
}

export interface Tracks {
    href: string;
    limit: number;
    next: string;
    offset: number;
    previous: string;
    total: number;
    items: Item[];
}

export interface Item {
    added_at: string;
    added_by: Owner;
    is_local: boolean;
    track: Track;
}

export interface Track {
    album: Album;
    artists: Artist[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIDS;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: LinkedFrom;
    restrictions: Restrictions;
    name: string;
    popularity: number;
    preview_url: string;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface Album {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: Restrictions;
    type: string;
    uri: string;
    artists: Owner[];
}

export interface Restrictions {
    reason: string;
}

export interface Artist {
    external_urls: ExternalUrls;
    followers: Followers;
    genres: string[];
    href: string;
    id: string;
    images: Image[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
}

export interface ExternalIDS {
    isrc: string;
    ean: string;
    upc: string;
}

export interface LinkedFrom {
}
