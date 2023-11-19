import { EmbedBuilder, Events, Message } from "discord.js";
import { StreamType, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import crypto from "crypto";

import { globalPrefix, serverId } from "../../../index.js";
import client from "../../../client.js";
import { CreateVoiceInstance, CurrentPlayerInstance, CurrentPlayingUUID, CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance, HandlePlayingSession } from "./player.js";
import { getYouTubePlaylistId, getYouTubeVideoId, isValidUrl } from "../../../utils/utils.js";
import { Playlist } from "../../../db.js";
import axios from "axios";
import { YouTubeAPIType } from "../../../types/YouTubeVideoType.js";
import ytdl from "ytdl-core";
import { YouTubeSearchResultType, YouTubeSearchType } from "../../../types/YouTubeSearchType.js";
import { YouTubePlaylistType } from "../../../types/YouTubePlaylistType.js";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "queue") {
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
                await ct.reply("⛔ Hàng chờ trống, hãy thêm 1 bài hát nào đó bằng cách dùng lệnh `;play <liên kết video YouTube hoặc từ khoá tìm kiếm>`");
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
                        text: "Ảo Ảnh Xanh",
                        icon_url: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png"
                    }
                }]
            });
            return;
        }

        if (msg[0] === "play" || msg[0] === "stop" || msg[0] === "skip") {
            const guild = client.guilds.cache.get(serverId);
            const mem = guild.members.cache.get(ct.author.id);

            if (!mem.voice.channel) {
                ct.reply("**❌ Lỗi**: Bạn chưa vào một voice channel nào cả, hãy vào 1 voice channel bất kỳ sau đó thử lại!");
                return;
            }

            const voiceChannel = mem.voice.channel;

            switch (msg[0]) {
                case "play":

                    if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot Ảo Ảnh Xanh đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
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

                    if (isValidUrl(msg[1]) && getYouTubePlaylistId(msg[1]) !== "") {
                        const playlistRp = await ct.reply("*🔍 Đang lấy dữ liệu của playlist, vui lòng chờ...*");
                        try {
                            const res = await axios.get("https://vid.priv.au/api/v1/playlists/" + getYouTubePlaylistId(msg[1]));

                            if (res.data) {
                                const playlistResponse = res.data as YouTubePlaylistType;
                                if (playlistResponse.videos.length < 1) {
                                    await playlistRp.edit("**❌ Playlist này trống!**");
                                    return;
                                }

                                for (let i = 0; i < playlistResponse.videos.length; i++) {
                                    await Playlist.create({
                                        uid: crypto.randomUUID(),
                                        addedAt: Date.now(),
                                        addedBy: ct.author.id,
                                        url: "https://www.youtube.com/watch?v=" + playlistResponse.videos[i].videoId,
                                        played: 0,
                                        title: playlistResponse.videos[i].title,
                                        streamingType: 0,
                                        originalUrl: "https://www.youtube.com/watch?v=" + playlistResponse.videos[i].videoId
                                    });
                                }

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
                                            text: "Ảo Ảnh Xanh",
                                            icon_url: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png"
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
                        if (isValidUrl(msg[1])) {
                            if (!ytdl.validateURL(msg[1])) {
                                await ct.reply("**❌ Lỗi**: Liên kết không đúng định dạng hoặc không được hỗ trợ!");
                                return;
                            }
                            targetUrl = msg[1];
                        } else {
                            let keyword = "";
                            for (let i = 1; i < msg.length; i++) {
                                keyword += (msg[i] + " ");
                            }

                            const searchRp = await ct.reply("*🔍 Đang tìm kiếm, vui lòng chờ...*");

                            try {
                                const res = await axios.get("https://vid.priv.au/api/v1/search?q=" + encodeURIComponent(keyword));

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
                                            text: "Ảo Ảnh Xanh",
                                            iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
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
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot Ảo Ảnh Xanh đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
                    } else if (CurrentVoiceInstance === null) {
                        ct.reply("**❌ Lỗi**: Hiện tại đang không phát ở bất cứ kênh nào!");
                        return;
                    }

                    const track = await Playlist.findOne({
                        where: { played: 0 }, order: [
                            ['id', 'ASC'],
                        ]
                    });

                    await Playlist.update({ played: 1 }, { where: { uid: track.uid } });

                    HandlePlayingSession(3);

                    await voiceChannel.send(`✅ Đã bỏ qua bài hiện tại!`);

                    break;
                case "stop":
                    if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                        ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot Ảo Ảnh Xanh đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
                    } else if (CurrentVoiceInstance === null) {
                        ct.reply("**❌ Lỗi**: Hiện tại đang không phát ở bất cứ kênh nào!");
                        return;
                    }

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
            }
        }
    }

}

export default evt;