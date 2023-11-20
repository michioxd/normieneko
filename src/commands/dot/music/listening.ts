import { ChannelType, Events, Message, VoiceState } from "discord.js";
import { CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance } from "./player.js";
import client from "../../../client.js";
import cfg from "../../../config.js";

const evt = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute: async (oldState: VoiceState, newState: VoiceState) => {
        if (CurrentVoiceInstance === null) return;
        if (CurrentVoiceChannelId === "") return;
        const voiceChannel = client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId);

        if (voiceChannel?.type === ChannelType.GuildVoice) {
            if (voiceChannel?.members.size <= 1) {
                DestoryInstance();
                //@ts-ignore
                await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Bạn đã để bot Ảo Ảnh Xanh ở một mình :sob:, đang rời đi...");
            }
        }
    }
}

export default evt;