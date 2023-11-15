import { Events, Message } from "discord.js";
import { createAudioPlayer } from "@discordjs/voice";

import { globalPrefix, serverId } from "../../../index.js";
import client from "../../../client.js";

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
                ct.reply("**Lỗi**: Bạn chưa vào một voice channel nào cả, hãy vào 1 voice channel bất kỳ sau đó thử lại!");
                return;
            }
        }

    }
}

export default evt;