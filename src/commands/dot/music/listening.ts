import { Events, Message, VoiceState } from "discord.js";
import { CurrentVoiceChannelId, CurrentVoiceInstance, DestoryInstance } from "./player";

const evt = {
    name: Events.VoiceStateUpdate,
    once: false,
    execute: async (oldState: VoiceState, newState: VoiceState) => {
        if (CurrentVoiceInstance === null) return;
        if (CurrentVoiceChannelId !== oldState.channelId && CurrentVoiceChannelId !== newState.channelId) return;
        const oldChannelMembers = oldState.channel?.members.size || 0;
        const newChannelMembers = newState.channel?.members.size || 0;

        if (oldChannelMembers > 1 && newChannelMembers === 1) {
            DestoryInstance();
            //@ts-ignore
            await client.guilds.cache.get(cfg.serverId).channels.cache.get(CurrentVoiceChannelId).send("❌ Bạn đã để bot Ảo Ảnh Xanh ở một mình :sob:, đang rời đi...");
        }
    }
}

export default evt;