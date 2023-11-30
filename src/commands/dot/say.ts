import { ChannelType, Events, Message } from "discord.js";

import { emotion } from "./emotion.js";
import cfg from "../../config.js";
import client from "../../client.js";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(cfg.globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "say" || msg[0] === "s") {
            let message = "";
            for (let i = 1; i < msg.length; i++) {
                message += (msg[i] + " ");
            }
            if (!message || message.length < 1) {
                ct.reply("**Cách dùng: `;say <nội dung>` hoặc `;s <nội dung>`");
                return;
            }

            const channel = client.guilds.cache.get(cfg.serverId).channels.cache.get(ct.channelId);
            if (channel) {
                if (ct.deletable) {
                    await ct.delete();
                }
                //@ts-ignore
                await channel.send(message);
            }
        }

    }
}

export default evt;