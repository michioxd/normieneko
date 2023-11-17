import { StreamType, VoiceConnection, createAudioResource } from "@discordjs/voice";
import { CurrentPlayerInstance, CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance, VoicePlaying, VoiceReadyState } from "./player.js";
import { Playlist } from "../../../db.js";
import { delay, getYouTubeVideoId } from "../../../utils/utils.js";
import client from "../../../client.js";
import { serverId } from "../../../index.js";
import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { YouTubeAPIType } from "../../../types/YouTubeVideoType.js";

export let CurrentPlayingUUID = "";

export default function PlayerDaemon() {
    (async () => {
        while (true) {
            if (VoiceReadyState === false || VoicePlaying === true) continue;



            await delay(2000);
        }
    })();
}