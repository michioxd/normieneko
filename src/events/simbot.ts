import { Events, Message } from "discord.js";
import { readFile } from "node:fs/promises";
import axios from 'axios';

import botHandle from "../index.js";
import log from "../utils/logger.js";
import client from "../client.js";

let lastTimeBomb = 0;

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        if (ct.channelId !== "1139181936053583904") return;

        const channel = client.channels.cache.get(ct.channelId);

        if (ct.content === "help" || ct.content === "giup" || ct.content === "deo biet dung" || ct.content === "$" || ct.content === ".") {
            //@ts-ignore
            channel.send("Cách dùng `.<nội dung cần nhắn>` \nVí dụ: `.đm m nqu the =))`");
            return;
        }

        if (!ct.content.startsWith(".")) return;

        const msg = ct.content.slice(1, ct.content.length);
        //const msg = ct.content;

        if (msg.length < 1) return;

        // if (Date.now() - lastTimeBomb <= 7777) {
        //     //@ts-ignore
        //     channel.send("Duma sống chậm thôi cháy bot nhà người ta :)) Đợi 7.777s nữa đi :))");
        // }

        try {
            const response = await axios.post(
                'https://api.simsimi.vn/v2/simtalk',
                new URLSearchParams({
                    'text': msg,
                    'lc': 'vn'
                })
            );

            //@ts-ignore
            channel.send(response.data.message ?? `\`\`\`\nĐã xảy ra sự cố, vui lòng thử lại sau! [EMPTY]\n\`\`\``);

            lastTimeBomb = Date.now();

        } catch (e) {
            log({ type: 'error', message: "Cannot fetch simsimi api!" + e });

            //@ts-ignore
            channel.send(`\`\`\`\nĐã xảy ra sự cố, vui lòng thử lại sau! [ERR_2]\n\`\`\``);
        }

    }
}

export default evt;