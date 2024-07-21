import { EmbedBuilder, Events, Message } from "discord.js";
import crypto from "crypto";
import client from "../../../client.js";
import { CreateVoiceInstance, CurrentPlayerInstance, CurrentPlayingUUID, CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance, HandlePlayingSession, ResetLoopCount, VoicePlaying } from "./player.js";
import { getSpotifyAlbumId, getSpotifyPlaylistId, getSpotifyTrackId, getYouTubePlaylistId, getYouTubeVideoId, isValidUrl } from "../../../utils/utils.js";
import { Playlist } from "../../../db.js";
import axios from "axios";
import ytdl from "ytdl-core";
import { YouTubeSearchResultType, YouTubeSearchType } from "../../../types/YouTubeSearchType.js";
import { YouTubePlaylistType } from "../../../types/YouTubePlaylistType.js";
import cfg from "../../../config.js";
import { GetAccessToken } from "../../../modules/spotify.js";
import { SpotifyPlaylistType } from "../../../types/SpotifyPlaylistType.js";
import { SpotifyTrackType } from "../../../types/SpotifyTrackType.js";
import { SpotifyAlbumType } from "../../../types/SpotifyAlbumType.js";

export let LoopAudioUUID: string = "";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(cfg.globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "queue" || msg[0] === "q") {
            if (msg[1] === "clear") {
                await Playlist.destroy({
                    where: {},
                    truncate: true
                });
                await ct.reply("🗑️ Đã xoá toàn bộ hàng chờ!");
                return;
            }

            const getPage = msg[1] ? parseInt(msg[1]) : 1;
            const page = getPage <= 0 ? 1 : getPage;

            const pageOffset = (page - 1) * 10;

            const queue = await Playlist.findAll({ where: { played: 0 }, order: [['id', 'ASC']], limit: 10, offset: pageOffset });

            if (queue.length < 1) {
                await ct.reply("⛔ Hàng chờ trống, hãy thêm 1 bài hát nào đó bằng cách dùng lệnh `;play <liên kết video/playlist YouTube hoặc từ khoá tìm kiếm>`");
                return;
            }

            const totalQuery = await Playlist.count({ where: { played: 0 } });
            const totalPage = Math.ceil(totalQuery / 10);

            let records = "";

            for (let i = 0; i < queue.length; i++) {
                if (queue[i].uid === CurrentPlayingUUID) {
                    records += `▶️ **${i + 1}. [${queue[i].title}](${queue[i].originalUrl})\n**`;
                } else {
                    records += `${i + 1}. [${queue[i].title}](${queue[i].originalUrl})\n`;
                }
            }

            await ct.reply({
                embeds: [{
                    author: {
                        name: "📚 Dach sách hàng chờ"
                    },
                    description: `${records}\n📖 Trang **${page}** trên **${totalPage}** trong tổng số **${totalQuery}**${page + 1 <= totalPage ? `\n▶️ Qua trang tiếp theo: \`;queue ${page + 1}\`` : ""}\n🗑️ Xoá tất cả: \`;queue clear\``,
                    footer: {
                        text: "BÚN GREEN",
                        icon_url: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp"
                    }
                }]
            });
            return;
        }

        if (msg[0] === "play" || msg[0] === "p" || msg[0] === "stop" || msg[0] === "skip" || msg[0] === "loop") {
            const guild = client.guilds.cache.get(cfg.serverId);
            const mem = guild.members.cache.get(ct.author.id);

            if (!mem.voice.channel) {
                ct.reply("**❌ Lỗi**: Bạn chưa vào một voice channel nào cả, hãy vào 1 voice channel bất kỳ sau đó thử lại!");
                return;
            }

            const voiceChannel = mem.voice.channel;

            switch (msg[0]) {
                case "p":
                case "play":
                    if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot BÚN GREEN đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
                        return;
                    }

                    if (!msg[1]) {
                        const checkQueue = await Playlist.count({ where: { played: 0 } });
                        if (checkQueue > 0) {
                            CreateVoiceInstance(voiceChannel.id, guild.id, voiceChannel.guild.voiceAdapterCreator, voiceChannel);
                            await voiceChannel.send(`✅ Đã vào channel **${voiceChannel.name}**, đang tiếp tục phát nhạc trong hàng chờ!`);
                            return;
                        }
                        await ct.reply("**❌ Lỗi**: Vui lòng cung cấp từ khoá tìm kiếm hoặc liên kết tới video trên YouTube!");
                        return;
                    }

                    let targetUrl = "";
                    if (isValidUrl(msg[1]) && getSpotifyAlbumId(msg[1])) {
                        // handle spotfiy playlist
                        const playlistSpotifyRp = await ct.reply("*<a:aax_vailolae:1132367020856442940> Đang lấy dữ liệu của album trên Spotify, vui lòng chờ...*");

                        try {
                            const getAccessToken = await GetAccessToken();
                            if (getAccessToken === false) {
                                await playlistSpotifyRp.edit("**❌ Lỗi**: Không thể kết nối tới Spotify!");
                                return;
                            }
                            const getAlbumData = await axios.get(`https://api.spotify.com/v1/albums/${getSpotifyAlbumId(msg[1])}`, {
                                headers: {
                                    'Authorization': `Bearer ${getAccessToken}`,
                                }
                            });

                            if (getAlbumData.data) {
                                const alSpotifyRes = getAlbumData.data as SpotifyAlbumType;
                                if (alSpotifyRes.tracks.items.length < 0) {
                                    await playlistSpotifyRp.edit("**❌ Album này trống!**");
                                    return;
                                }

                                let insertData = [];

                                for (let i = 0; i < alSpotifyRes.tracks.items.length; i++) {
                                    const item = alSpotifyRes.tracks.items[i];
                                    let artist = "";
                                    for (let i = 0; i < item.artists.length; i++) {
                                        artist += (item.artists[i].name + (i !== item.artists.length - 1 ? ", " : ""));
                                    }
                                    insertData = [
                                        ...insertData,
                                        {
                                            uid: crypto.randomUUID(),
                                            addedAt: Date.now(),
                                            addedBy: ct.author.id,
                                            url: "https://open.spotify.com/track/" + item.id,
                                            played: 0,
                                            title: artist + " - " + item.name,
                                            streamingType: 0,
                                            fromTitle: 1,
                                            originalUrl: "https://open.spotify.com/track/" + item.id
                                        }
                                    ]
                                }

                                await Playlist.bulkCreate(insertData);

                                await playlistSpotifyRp.edit({
                                    content: "✅ Đã thêm album từ Spotify vào hàng chờ!",
                                    embeds: [{
                                        author: {
                                            name: alSpotifyRes.name,
                                            url: "https://open.spotify.com/playlist/" + alSpotifyRes.id
                                        },
                                        thumbnail: {
                                            url: alSpotifyRes.images[0].url
                                        },
                                        description: `Đã thêm **${alSpotifyRes.tracks.items.length}** bài hát từ album Spotify vào hàng chờ bởi <@!${ct.author.id}>`,
                                        footer: {
                                            text: "BÚN GREEN",
                                            icon_url: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp"
                                        }
                                    }]
                                });
                            } else {
                                await playlistSpotifyRp.edit("**❌ Lỗi**: Không thể lấy album từ Spotify, vui lòng thử lại sau! `[EMPTY_DATA]`");
                                return;
                            }

                        } catch (e) {
                            await playlistSpotifyRp.edit("**❌ Lỗi**: Không thể lấy album từ Spotify, vui lòng thử lại sau! `[CATCH_ERR]`");
                            return;
                        }
                    } else if (isValidUrl(msg[1]) && getSpotifyPlaylistId(msg[1])) {
                        // handle spotfiy playlist
                        const playlistSpotifyRp = await ct.reply("*<a:aax_vailolae:1132367020856442940> Đang lấy dữ liệu của playlist trên Spotify, vui lòng chờ...*");

                        try {
                            const getAccessToken = await GetAccessToken();
                            if (getAccessToken === false) {
                                await playlistSpotifyRp.edit("**❌ Lỗi**: Không thể kết nối tới Spotify!");
                                return;
                            }
                            const getPlaylistData = await axios.get(`https://api.spotify.com/v1/playlists/${getSpotifyPlaylistId(msg[1])}`, {
                                headers: {
                                    'Authorization': `Bearer ${getAccessToken}`,
                                }
                            });

                            if (getPlaylistData.data) {
                                const plSpotifyRes = getPlaylistData.data as SpotifyPlaylistType;
                                if (plSpotifyRes.tracks.items.length < 0) {
                                    await playlistSpotifyRp.edit("**❌ Playlist này trống!**");
                                    return;
                                }

                                let insertData = [];

                                for (let i = 0; i < plSpotifyRes.tracks.items.length; i++) {
                                    const item = plSpotifyRes.tracks.items[i];
                                    let artist = "";
                                    for (let i = 0; i < item.track.artists.length; i++) {
                                        artist += (item.track.artists[i].name + (i !== item.track.artists.length - 1 ? ", " : ""));
                                    }
                                    insertData = [
                                        ...insertData,
                                        {
                                            uid: crypto.randomUUID(),
                                            addedAt: Date.now(),
                                            addedBy: ct.author.id,
                                            url: "https://open.spotify.com/track/" + item.track.id,
                                            played: 0,
                                            title: artist + " - " + item.track.name,
                                            streamingType: 0,
                                            fromTitle: 1,
                                            originalUrl: "https://open.spotify.com/track/" + item.track.id
                                        }
                                    ]
                                }

                                await Playlist.bulkCreate(insertData);

                                await playlistSpotifyRp.edit({
                                    content: "✅ Đã thêm playlist từ Spotify vào hàng chờ!",
                                    embeds: [{
                                        author: {
                                            name: plSpotifyRes.name,
                                            url: "https://open.spotify.com/playlist/" + plSpotifyRes.id
                                        },
                                        thumbnail: {
                                            url: plSpotifyRes.images[0].url
                                        },
                                        description: `Đã thêm **${plSpotifyRes.tracks.items.length}** bài hát từ playlist Spotify vào hàng chờ bởi <@!${ct.author.id}>`,
                                        footer: {
                                            text: "BÚN GREEN",
                                            icon_url: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp"
                                        }
                                    }]
                                });
                            } else {
                                await playlistSpotifyRp.edit("**❌ Lỗi**: Không thể lấy playlist từ Spotify, vui lòng thử lại sau! `[EMPTY_DATA]`");
                                return;
                            }

                        } catch (e) {
                            await playlistSpotifyRp.edit("**❌ Lỗi**: Không thể lấy playlist từ Spotify, vui lòng thử lại sau! `[CATCH_ERR]`");
                            return;
                        }
                    } else if (isValidUrl(msg[1]) && getSpotifyTrackId(msg[1]) !== "") {
                        // handle spotfiy track
                        const trackSpotifyRp = await ct.reply("*<a:aax_vailolae:1132367020856442940> Đang lấy dữ liệu của bài hát trên Spotify, vui lòng chờ...*");

                        try {
                            const getAccessToken = await GetAccessToken();
                            if (getAccessToken === false) {
                                await trackSpotifyRp.edit("**❌ Lỗi**: Không thể kết nối tới Spotify!");
                                return;
                            }
                            const getTrackData = await axios.get(`https://api.spotify.com/v1/tracks/${getSpotifyTrackId(msg[1])}`, {
                                headers: {
                                    'Authorization': `Bearer ${getAccessToken}`,
                                }
                            });

                            if (getTrackData.data) {
                                const trackSpotifyRes = getTrackData.data as SpotifyTrackType;
                                let artist = "";
                                for (let i = 0; i < trackSpotifyRes.artists.length; i++) {
                                    artist += (trackSpotifyRes.artists[i].name + (i !== trackSpotifyRes.artists.length - 1 ? ", " : ""));
                                }
                                await Playlist.create({
                                    uid: crypto.randomUUID(),
                                    addedAt: Date.now(),
                                    addedBy: ct.author.id,
                                    url: "https://open.spotify.com/track/" + trackSpotifyRes.id,
                                    played: 0,
                                    title: artist + " - " + trackSpotifyRes.name,
                                    streamingType: 0,
                                    fromTitle: 1,
                                    originalUrl: "https://open.spotify.com/track/" + trackSpotifyRes.id
                                });

                                const embed = new EmbedBuilder()
                                    .setTitle(artist + " - " + trackSpotifyRes.name)
                                    .setURL("https://open.spotify.com/track/" + trackSpotifyRes.id)
                                    .setDescription(`Đã thêm vào hàng chờ từ Spotify bởi <@!${ct.author.id}>`)
                                    .setImage(trackSpotifyRes.album.images[0].url)
                                    .setColor("#f50018")
                                    .setFooter({
                                        text: "BÚN GREEN",
                                        iconURL: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp",
                                    })
                                    .setTimestamp();

                                trackSpotifyRp.edit({
                                    content: "✅ Đã thêm bài hát từ Spotify vào hàng chờ!",
                                    embeds: [embed]
                                });
                            } else {
                                await trackSpotifyRp.edit("**❌ Lỗi**: Không thể lấy bài hát từ Spotify, vui lòng thử lại sau! `[EMPTY_DATA]`");
                                return;
                            }
                        } catch (e) {
                            await trackSpotifyRp.edit("**❌ Lỗi**: Không thể lấy bài hát từ Spotify, vui lòng thử lại sau! `[CATCH_ERR]`");
                            return;
                        }

                    } else if (isValidUrl(msg[1]) && getYouTubePlaylistId(msg[1]) !== "") {
                        // handle YouTube Playlist
                        const playlistRp = await ct.reply("*<a:aax_vailolae:1132367020856442940> Đang lấy dữ liệu của playlist, vui lòng chờ...*");
                        try {
                            const res = await axios.get("https://" + cfg.invidiousEndpoint + "/api/v1/playlists/" + getYouTubePlaylistId(msg[1]));

                            if (res.data) {
                                const playlistResponse = res.data as YouTubePlaylistType;
                                if (playlistResponse.videos.length < 1) {
                                    await playlistRp.edit("**❌ Playlist này trống!**");
                                    return;
                                }

                                let insertData = [];

                                for (let i = 0; i < playlistResponse.videos.length; i++) {

                                    insertData = [
                                        ...insertData,
                                        {
                                            uid: crypto.randomUUID(),
                                            addedAt: Date.now(),
                                            addedBy: ct.author.id,
                                            url: "https://www.youtube.com/watch?v=" + playlistResponse.videos[i].videoId,
                                            played: 0,
                                            title: playlistResponse.videos[i].title,
                                            streamingType: 0,
                                            originalUrl: "https://www.youtube.com/watch?v=" + playlistResponse.videos[i].videoId
                                        }
                                    ]
                                }

                                await Playlist.bulkCreate(insertData);

                                await playlistRp.edit({
                                    content: "✅ Đã thêm playlist vào hàng chờ!",
                                    embeds: [{
                                        author: {
                                            name: playlistResponse.title,
                                            url: "https://www.youtube.com/playlist?list=" + playlistResponse.playlistId
                                        },
                                        thumbnail: {
                                            url: playlistResponse.playlistThumbnail
                                        },
                                        description: `Đã thêm **${playlistResponse.videos.length}** bài hát vào hàng chờ bởi <@!${ct.author.id}>`,
                                        footer: {
                                            text: "BÚN GREEN",
                                            icon_url: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp"
                                        }
                                    }]
                                });

                            } else {
                                await playlistRp.edit("**❌ Lỗi**: Không thể lấy playlist, vui lòng thử lại sau! `[EMPTY_DATA]`");
                                return;
                            }
                        } catch (e) {
                            await playlistRp.edit("**❌ Lỗi**: Không thể lấy playlist, vui lòng thử lại sau! `[CATCH_ERR]`");
                            return;
                        }
                    } else {
                        // handle Normal request
                        if (isValidUrl(msg[1])) {
                            if (!ytdl.validateURL(msg[1])) {
                                await ct.reply("**❌ Lỗi**: Liên kết không đúng định dạng hoặc không được hỗ trợ!");
                                return;
                            }
                            targetUrl = msg[1];
                        } else {
                            // handle search
                            let keyword = "";
                            for (let i = 1; i < msg.length; i++) {
                                keyword += (msg[i] + " ");
                            }

                            const searchRp = await ct.reply("*🔍 Đang tìm kiếm, vui lòng chờ...*");

                            try {
                                const res = await axios.get("https://" + cfg.invidiousEndpoint + "/api/v1/search?type=video&q=" + encodeURIComponent(keyword));

                                if (res.data) {
                                    const searchData = res.data as YouTubeSearchType[];
                                    let searchVideoId = "";
                                    for (let i = 0; i < searchData.length; i++) {
                                        if (searchData[i].type === YouTubeSearchResultType.Video) {
                                            searchVideoId = searchData[i].videoId;
                                            break;
                                        }
                                    }

                                    targetUrl = "https://www.youtube.com/watch?v=" + searchVideoId;
                                    searchRp.delete();
                                } else {
                                    await searchRp.edit("**❌ Lỗi**: Không thể tìm kiếm, vui lòng thử lại sau! `[EMPTY_DATA]`");
                                    return;
                                }
                            } catch (e) {
                                await searchRp.edit("**❌ Lỗi**: Không thể tìm kiếm, vui lòng thử lại sau! `[CATCH_ERR]`");
                                return;
                            }
                        }

                        // handle youtube url
                        if (ytdl.validateURL(targetUrl)) {
                            const rp = await ct.reply("*<a:aax_vailolae:1132367020856442940> Đang lấy dữ liệu, vui lòng chờ...*");
                            try {
                                const res = await ytdl.getBasicInfo(targetUrl);
                                if (res) {
                                    const details = res.videoDetails;
                                    const embed = new EmbedBuilder()
                                        .setAuthor({
                                            name: details.author.name,
                                            url: details.author.channel_url,
                                            iconURL: details.author.thumbnails[0].url,
                                        })
                                        .setTitle(details.title)
                                        .setURL(details.video_url)
                                        .setDescription(`Đã thêm vào hàng chờ - bởi <@!${ct.author.id}>`)
                                        .setImage(details.thumbnails[details.thumbnails.length - 1].url)
                                        .setColor("#f50018")
                                        .setFooter({
                                            text: "BÚN GREEN",
                                            iconURL: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp",
                                        })
                                        .setTimestamp();

                                    await Playlist.create({
                                        uid: crypto.randomUUID(),
                                        addedAt: Date.now(),
                                        addedBy: ct.author.id,
                                        url: details.video_url,
                                        played: 0,
                                        title: details.title,
                                        streamingType: 0,
                                        originalUrl: details.video_url
                                    });

                                    await rp.edit({
                                        content: "✅ Đã thêm vào hàng chờ!",
                                        embeds: [embed]
                                    });

                                } else {
                                    ct.reply("**❌ Lỗi**: Không thể lấy dữ liệu của video YouTube đó, vui lòng kiểm tra lại! *(Lưu ý: Video riêng tư sẽ không thể hoạt động)*");
                                }

                            } catch (e) {
                                ct.reply("**❌ Lỗi**: Không thể lấy dữ liệu của video YouTube đó, vui lòng kiểm tra lại! *(Lưu ý: Video riêng tư sẽ không thể hoạt động)*");
                            }
                        }
                    }

                    if (CurrentVoiceInstance === null) {
                        CreateVoiceInstance(voiceChannel.id, guild.id, voiceChannel.guild.voiceAdapterCreator, voiceChannel);
                        await voiceChannel.send(`✅ Đã vào channel **${voiceChannel.name}**!`);
                    }

                    break;
                case "skip":

                    if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot BÚN GREEN đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
                        return;
                    } else if (CurrentVoiceInstance === null) {
                        ct.reply("**❌ Lỗi**: Hiện tại đang không phát ở bất cứ kênh nào!");
                        return;
                    }

                    const track = await Playlist.findOne({
                        where: { played: 0 }, order: [
                            ['id', 'ASC'],
                        ]
                    });

                    try {
                        await Playlist.update({ played: 1 }, { where: { uid: track.uid } });
                    } catch (e) { }


                    HandlePlayingSession(3);

                    await voiceChannel.send(`✅ Đã bỏ qua bài hiện tại!`);

                    break;
                case "stop":
                    if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot BÚN GREEN đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
                        return;
                    } else if (CurrentVoiceInstance === null) {
                        ct.reply("**❌ Lỗi**: Hiện tại đang không phát ở bất cứ kênh nào!");
                        return;
                    }

                    LoopAudioUUID = "";
                    ResetLoopCount();
                    DestoryInstance();
                    if (msg[1] === "clear") {
                        await Playlist.destroy({
                            where: {},
                            truncate: true
                        });
                        await voiceChannel.send("**🛑/🗑️ Đã dừng đồng thời xoá toàn bộ hàng chờ!**");
                    } else {
                        await Playlist.update({ played: 1 }, { where: { uid: CurrentPlayingUUID } });
                        await voiceChannel.send("**🛑 Đã dừng!**");
                    }
                    break;
                case "loop":
                    if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot BÚN GREEN đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
                    } else if (CurrentVoiceInstance === null) {
                        ct.reply("**❌ Lỗi**: Hiện tại đang không phát ở bất cứ kênh nào!");
                        return;
                    } else if (CurrentPlayingUUID === "") {
                        ct.reply("**❌ Lỗi**: Hiện tại đang không phát nhạc nào cả!");
                        return;
                    }

                    if (LoopAudioUUID === "") {
                        LoopAudioUUID = CurrentPlayingUUID;
                        ct.reply("**✅-🔁** Đã bật chế độ lặp lại, gọi lại lệnh này thêm 1 lần nữa để tắt");
                    } else {
                        LoopAudioUUID = "";
                        ResetLoopCount();
                        ct.reply("**🚫-🔁** Đã tắt chế độ lặp lại, gọi lại lệnh này thêm 1 lần nữa để bật");
                    }

                    break;
            }
        }
    }

}

export default evt;