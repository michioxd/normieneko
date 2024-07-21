import { ChannelType, Events, Message, VoiceState } from "discord.js";
import { CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance } from "./player.js";
import client from "../../../client.js";
import cfg from "../../../config.js";

const evt = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute: async () => {
        if (CurrentVoiceInstance === null) return;
        if (CurrentVoiceChannelId === "") return;
        const voiceChannel = client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId);

        if (!voiceChannel) {
            DestoryInstance();
            return;
        }
        if (voiceChannel?.type === ChannelType.GuildVoice) {
            if (voiceChannel?.members.size <= 1) {
                //@ts-ignore
                await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Bạn đã để bot BÚN GREEN ở một mình :sob:, đang rời đi...");
                DestoryInstance();
            }
        }
    }
}

export default evt;