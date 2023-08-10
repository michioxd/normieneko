import { Events, Message } from "discord.js";
import client from "./client";

const prefix = "$";

let lastTimeBomb = 0;

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        if (!ct.content.startsWith(prefix)) return;

        const channel = client.channels.cache.get(ct.channelId);

        if (Date.now() - lastTimeBomb <= 5000) {
            //@ts-ignore
            channel.send("Duma sống chậm thôi cháy bot nhà người ta :)) Đợi 5s nữa đi :))");
        }

    }
}

export default evt;