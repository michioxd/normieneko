import axios from "axios";
import { SpotifyAccessToken } from "../db.js";
import cfg from "../config.js";

export interface SpotifyRefreshTokenType {
    access_token: string;
    token_type: string;
    expires_in: number;
}


export async function GetAccessToken() {
    const getToken = await SpotifyAccessToken.findOne({
        order: [['id', 'DESC']],
    });

    if (!getToken || getToken.lastUpdated + 3600 * 1000 <= Date.now()) {
        const waitToken = await UpdateRefreshToken();
        return waitToken !== false ? waitToken : false;
    }

    return getToken.token;
}

export async function UpdateRefreshToken() {
    try {
        const getToken = await axios.post(
            'https://accounts.spotify.com/api/token',
            `grant_type=client_credentials&client_id=${cfg.spotifyApi.cid}&client_secret=${cfg.spotifyApi.cs}`,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        if (getToken.data) {
            const res = getToken.data as SpotifyRefreshTokenType;
            await SpotifyAccessToken.destroy({ where: {}, truncate: true });
            await SpotifyAccessToken.create({
                token: res.access_token,
                lastUpdated: Date.now()
            });
            return res.access_token;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}