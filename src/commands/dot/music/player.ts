import { AudioPlayer, AudioPlayerStatus, StreamType, VoiceConnection, VoiceConnectionStatus, createAudioPlayer, createAudioResource, demuxProbe, joinVoiceChannel } from "@discordjs/voice";
import { EmbedBuilder, InternalDiscordGatewayAdapterCreator, VoiceBasedChannel, VoiceState } from "discord.js";
import log from "../../../utils/logger.js";
import { Playlist } from "../../../db.js";
import axios from "axios";
import { YouTubeAPIType } from "../../../types/YouTubeVideoType.js";
import { getYouTubeVideoId } from "../../../utils/utils.js";
import client from "../../../client.js";
import { serverId } from "../../../index.js";
import got from "got";
import { Readable } from "node:stream";
import pReflect from "p-reflect";

export let CurrentVoiceChannelId: string = "";
export let CurrentVoiceInstance: VoiceConnection | null = null;
export let VoiceReadyState: boolean = false;

export let VoicePlaying: boolean = false;

export let CurrentPlayerInstance: AudioPlayer = createAudioPlayer();

export let CurrentPlayingUUID = "";

async function probeAndCreateResource(readableStream, error?: () => void) {
    let st: Readable | string = "./assets/error.webm", tp = StreamType.WebmOpus;
    try {
        const { stream, type } = await demuxProbe(readableStream);
        st = stream;
        tp = type;
    } catch (e) {
        error();
    }

    return createAudioResource(st, { inputType: tp });
}

export async function HandlePlayingSession(type?: number) {
    if (type === 3) CurrentPlayerInstance.stop();
    if (VoicePlaying === true) return;
    if (CurrentPlayingUUID !== "") {
        await Playlist.update({ played: 1 }, { where: { uid: CurrentPlayingUUID } });
    }

    try {
        const track = await Playlist.findOne({
            where: { played: 0 }, order: [
                ['id', 'ASC'],
            ]
        });

        if (track !== null) {
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Đang bắt đầu phát",
                })
                .setTitle(track.title)
                .setURL(track.originalUrl)
                .setDescription(`Được thêm bởi: <@!${track.addedBy}> vào lúc ${(new Date(track.addedAt)).toLocaleString('vi-VN')}`)
                .setFooter({
                    text: "Ảo Ảnh Xanh",
                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                });

            //@ts-ignore
            await client.guilds.cache.get(serverId).channels.cache.get(CurrentVoiceChannelId).send({
                embeds: [embed]
            });

            try {
                CurrentPlayingUUID = track.uid;
                const rs = await probeAndCreateResource(got.stream(track.url, {
                    headers: {
                        "user-agent": "Mozilla/ 5.0(Windows NT 10.0; Win64; x64) AppleWebKit / 537.36(KHTML, like Gecko) Chrome / 119.0.0.0 Safari / 537.36",
                        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
                        "Sec-Ch-Ua-Platform": "Windows"
                    },
                    retry: 5
                }), async function () {
                    //@ts-ignore
                    await client.guilds.cache.get(serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Đã xảy ra lỗi trong khi phát bài hát này, đang chuyển qua bài khác...");
                    HandlePlayingSession(3);
                });
                // const rs = createAudioResource(track.url, {
                //     inlineVolume: true,
                //     inputType: track.streamingType === 1 ? StreamType.WebmOpus : StreamType.Arbitrary
                // });
                CurrentPlayerInstance.play(rs);
            } catch (e) {
                console.log(e);
                //@ts-ignore
                await client.guilds.cache.get(serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Đã xảy ra lỗi trong khi phát bài hát này, đang chuyển qua bài khác...");
                HandlePlayingSession(3);
            }

        } else {
            // @ts-ignore
            await client.guilds.cache.get(serverId).channels.cache.get(CurrentVoiceChannelId).send("🟩 Không có bài nào trong hàng chờ, đang thoát...");
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
// CurrentPlayerInstance.on(AudioPlayerStatus.Buffering, () => {
//     console.log("Buffering");
// });
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