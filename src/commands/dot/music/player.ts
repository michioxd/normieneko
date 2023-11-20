import { AudioPlayer, AudioPlayerStatus, StreamType, VoiceConnection, createAudioPlayer, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { EmbedBuilder, InternalDiscordGatewayAdapterCreator, VoiceBasedChannel } from "discord.js";
import log from "../../../utils/logger.js";
import { Playlist } from "../../../db.js";
import client from "../../../client.js";
import ytdl from "ytdl-core";
import { Op, Sequelize } from "sequelize";
import cfg from "../../../config.js";
import axios from "axios";
import { YouTubeSearchResultType, YouTubeSearchType } from "../../../types/YouTubeSearchType.js";

export let CurrentVoiceChannelId: string = "";
export let CurrentVoiceInstance: VoiceConnection | null = null;
export let VoiceReadyState: boolean = false;

export let VoicePlaying: boolean = false;

export let CurrentPlayerInstance: AudioPlayer = createAudioPlayer();

export let CurrentPlayingUUID = "";

export async function HandlePlayingSession(type?: number) {
    if (type === 3) CurrentPlayerInstance.stop();
    if (VoicePlaying === true) return;
    if (CurrentPlayingUUID !== "") {
        try {
            await Playlist.update({ played: 1 }, { where: { uid: CurrentPlayingUUID } });
        } catch (e) { }
    }

    try {
        const track = await Playlist.findOne({
            where: { played: 0 }, order: [
                ['id', 'ASC'],
            ]
        });

        if (track !== null) {
            const nextTrack = await Playlist.findOne({
                where: {
                    played: 0, uid: {
                        [Op.ne]: track.uid,
                    }
                }, order: [
                    ['id', 'ASC'],
                ]
            });
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Đang bắt đầu phát",
                })
                .setTitle(track.title)
                .setURL(track.originalUrl)
                .setDescription(`Được thêm bởi **<@!${track.addedBy}>**${track.fromTitle ? " từ Spotify" : ""} vào lúc **${(new Date(track.addedAt)).toLocaleString('vi-VN')}**${nextTrack ? `\n▶️ Bài tiếp theo: **[${nextTrack.title}](${nextTrack.originalUrl})**` : ""}`)
                .setFooter({
                    text: "Ảo Ảnh Xanh",
                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                });

            //@ts-ignore
            await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send({
                embeds: [embed]
            });

            if (track.fromTitle === 1) {
                try {
                    const res = await axios.get("https://" + cfg.invidiousEndpoint + "/api/v1/search?type=video&q=" + encodeURIComponent(track.title));

                    if (res.data) {
                        const searchData = res.data as YouTubeSearchType[];
                        let searchVideoId = "";
                        for (let i = 0; i < searchData.length; i++) {
                            if (searchData[i].type === YouTubeSearchResultType.Video) {
                                searchVideoId = searchData[i].videoId;
                                break;
                            }
                        }

                        CurrentPlayingUUID = track.uid;
                        const rs = createAudioResource(ytdl("https://www.youtube.com/watch?v=" + searchVideoId, { filter: format => format.codecs === 'opus' && format.container === 'webm' }), {
                            inlineVolume: true,
                            inputType: StreamType.WebmOpus
                        });
                        CurrentPlayerInstance.play(rs);
                    } else {
                        //@ts-ignore
                        await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Đã xảy ra lỗi trong khi phát bài hát này, đang chuyển qua bài khác...");
                        HandlePlayingSession(3);
                    }
                } catch (e) {
                    //@ts-ignore
                    await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Đã xảy ra lỗi trong khi phát bài hát này, đang chuyển qua bài khác...");
                    HandlePlayingSession(3);
                }
            } else {
                try {
                    CurrentPlayingUUID = track.uid;
                    const rs = createAudioResource(ytdl(track.url, { filter: format => format.codecs === 'opus' && format.container === 'webm' }), {
                        inlineVolume: true,
                        inputType: StreamType.WebmOpus
                    });
                    CurrentPlayerInstance.play(rs);
                } catch (e) {
                    console.log(e);
                    //@ts-ignore
                    await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Đã xảy ra lỗi trong khi phát bài hát này, đang chuyển qua bài khác...");
                    HandlePlayingSession(3);
                }
            }

        } else {
            // @ts-ignore
            await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("🟩 Không có bài nào trong hàng chờ, đang thoát...");
            DestoryInstance();
        }
    } catch (e) {
        console.log(e);
    }
}

CurrentPlayerInstance.on(AudioPlayerStatus.Playing, () => VoicePlaying = true);
CurrentPlayerInstance.on(AudioPlayerStatus.Paused, () => {
    VoicePlaying = false;
});
CurrentPlayerInstance.on("error", (e) => {
    console.error(e);
    log({
        type: 3,
        message: "AudioPlayerError: " + e
    })
});
// CurrentPlayerInstance.on(AudioPlayerStatus.AutoPaused, () => {
//     console.log("Autopaused");
// });
CurrentPlayerInstance.on(AudioPlayerStatus.Idle, () => {
    VoicePlaying = false;
    HandlePlayingSession(1);
});
export function CreateVoiceInstance(voiceId: string, guildId: string, voiceAdapter: InternalDiscordGatewayAdapterCreator, voiceChannel: VoiceBasedChannel) {
    if (CurrentVoiceInstance && CurrentVoiceChannelId !== voiceId) {
        CurrentVoiceInstance.destroy();
    }

    if (CurrentVoiceInstance === null || CurrentVoiceChannelId !== voiceId) {
        CurrentVoiceInstance = joinVoiceChannel({
            guildId: guildId,
            channelId: voiceId,
            adapterCreator: voiceAdapter,
            selfDeaf: true,
            selfMute: false
        });
    }
    CurrentVoiceChannelId = voiceId;

    VoiceReadyState = true;
    CurrentVoiceInstance.subscribe(CurrentPlayerInstance);
    HandlePlayingSession(0);
}

export function DestoryInstance() {
    CurrentVoiceChannelId = "";
    CurrentVoiceInstance?.destroy();
    CurrentVoiceInstance = null;
    VoiceReadyState = false;
    CurrentPlayerInstance.stop();
    log({
        type: "info",
        message: "Instance destroyed!"
    });
}