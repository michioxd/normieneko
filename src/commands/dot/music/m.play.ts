import { EmbedBuilder, Events, Message } from "discord.js";
import { StreamType, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import crypto from "crypto";

import { globalPrefix, serverId } from "../../../index.js";
import client from "../../../client.js";
import { CreateVoiceInstance, CurrentPlayerInstance, CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance, HandlePlayingSession } from "./player.js";
import { getYouTubeVideoId, isValidUrl, isYouTubePlaylist, isYouTubeWatchUrl } from "../../../utils/utils.js";
import { Playlist } from "../../../db.js";
import axios from "axios";
import { YouTubeAPIType } from "../../../types/YouTubeVideoType.js";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "play") {
            const guild = client.guilds.cache.get(serverId);
            const mem = guild.members.cache.get(ct.author.id);

            if (!mem.voice.channel) {
                ct.reply("**❌ Lỗi**: Bạn chưa vào một voice channel nào cả, hãy vào 1 voice channel bất kỳ sau đó thử lại!");
                return;
            }

            const voiceChannel = mem.voice.channel;

            if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot Ảo Ảnh Xanh đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
            }

            if (msg[1].length < 1) {
                ct.reply("**❌ Lỗi**: Vui lòng cung cấp từ khoá tìm kiếm hoặc liên kết tới video/playlist trên YouTube!");
                return;
            }

            if (isValidUrl(msg[1])) {
                if (!isYouTubeWatchUrl(msg[1]) && !isYouTubePlaylist(msg[1])) {
                    await ct.reply("**❌ Lỗi**: Hiện tại chỉ hỗ trợ liên kết của YouTube!");
                    return;
                }

                if (isYouTubeWatchUrl(msg[1])) {
                    const rp = await ct.reply("*<a:aax_vailolae:1132367020856442940> Đang lấy dữ liệu, vui lòng chờ...*")
                    try {
                        const res = await axios.get(`https://invidious.fdn.fr/api/v1/videos/${getYouTubeVideoId(msg[1])}?hl=en-US`);
                        if (res) {
                            const youtubeRes = res.data as YouTubeAPIType;
                            let streamingType = 0, playUrl = "";
                            const embed = new EmbedBuilder()
                                .setAuthor({
                                    name: youtubeRes.author,
                                    url: "https://www.youtube.com/channel/" + youtubeRes.authorId,
                                    iconURL: youtubeRes.authorThumbnails[youtubeRes.authorThumbnails.length - 1].url,
                                })
                                .setTitle(youtubeRes.title)
                                .setURL("https://www.youtube.com/watch?v=" + youtubeRes.videoId)
                                .setDescription(`Đã thêm vào hàng chờ - bởi <@!${ct.author.id}>`)
                                .setImage(youtubeRes.videoThumbnails[0].url)
                                .setColor("#f50018")
                                .setFooter({
                                    text: "Ảo Ảnh Xanh",
                                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                                })
                                .setTimestamp();

                            for (let i = 0; i < youtubeRes.adaptiveFormats.length; i++) {
                                const d = youtubeRes.adaptiveFormats[i];
                                if (d.audioQuality === "AUDIO_QUALITY_MEDIUM") {
                                    if (d.type.startsWith("audio/webm") && d.encoding === "opus") {
                                        playUrl = d.url;
                                        streamingType = 1;
                                        break;
                                    } else if (d.type.startsWith("audio/mp4")) {
                                        playUrl = d.url;
                                        streamingType = 0;
                                    }
                                }
                            }

                            await Playlist.create({
                                uid: crypto.randomUUID(),
                                addedAt: Date.now(),
                                addedBy: ct.author.id,
                                url: playUrl,
                                played: 0,
                                title: youtubeRes.title,
                                streamingType: streamingType == 1 ? 1 : 0,
                                originalUrl: "https://www.youtube.com/watch?v=" + youtubeRes.videoId
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
        } else if (msg[0] === "stop") {
            const guild = client.guilds.cache.get(serverId);
            const mem = guild.members.cache.get(ct.author.id);
            if (!mem.voice.channel) {
                ct.reply("**❌ Lỗi**: Bạn chưa vào một voice channel nào cả, hãy vào 1 voice channel bất kỳ sau đó thử lại!");
                return;
            }
            const voiceChannel = mem.voice.channel;

            if (CurrentVoiceInstance !== null && CurrentVoiceChannelId !== voiceChannel.id) {
                ct.reply("**❌ Lỗi**: Bạn đã vào channel mà không có bot Ảo Ảnh Xanh đang ở trong đó, vui lòng chuyển qua channel có bot AAX!");
            } else if (CurrentPlayerInstance === null) {
                ct.reply("**❌ Lỗi**: Hiện tại đang không phát ở bất cứ kênh nào!");
                return;
            }

            DestoryInstance();
            await Playlist.update({ played: 1 }, { where: {} });
            voiceChannel.send("**🛑 Đã dừng!**");
        } else if (msg[0] === "skip") {
            const guild = client.guilds.cache.get(serverId);
            const mem = guild.members.cache.get(ct.author.id);
            if (!mem.voice.channel) {
                ct.reply("**❌ Lỗi**: Bạn chưa vào một voice channel nào cả, hãy vào 1 voice channel bất kỳ sau đó thử lại!");
                return;
            }
            const voiceChannel = mem.voice.channel;

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
        }

    }
}

export default evt;