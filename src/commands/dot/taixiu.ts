import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, Events, Message, time } from "discord.js";
import { setTimeout as wait } from 'node:timers/promises';

import { globalPrefix } from "../../index.js";
import { emotion } from "./emotion.js";
import client from "../../client.js";

/*const diceEmoji = [
    "", // empty for zero
    "<:aax_dice_1:1145880247926018088>",
    "<:aax_dice_2:1145880250870411304>",
    "<:aax_dice_3:1145880258227224657>",
    "<:aax_dice_4:1145880265831489598>",
    "<:aax_dice_5:1145880274874417152>",
    "<:aax_dice_6:1145880281690149055>",
    "<:aax_rolling_dice:1145880293434204281>" // must be 7
];*/

const diceEmoji = [
    "",
    "<:aax_dice_1:1145880247926018088>",
    "<:aax_dice_2:1145880250870411304>",
    "<:aax_dice_3:1145880258227224657>",
    "<:aax_dice_4:1145880265831489598>",
    "<:aax_dice_5:1145880274874417152>",
    "<:aax_dice_6:1145880281690149055>",
    "<a:aax_rolling_dice:1145880293434204281>"
];

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "taixiu") {
            const rep = await ct.reply({
                content: `# ...
${diceEmoji[7]} ${diceEmoji[7]} ${diceEmoji[7]}

ID Phiên: \`sessionIdComingSoon\`
Người tạo: <@!${ct.author.id}>`, components: []
            });

            let x1 = 0;
            let x2 = 0;
            let x3 = 0;

            while (x1 === x2 && x2 === x3) {
                x1 = Math.floor(Math.random() * 6) + 1;
                x2 = Math.floor(Math.random() * 6) + 1;
                x3 = Math.floor(Math.random() * 6) + 1;
            }

            const total = x1 + x2 + x3;

            const resSession = total >= 11 && total <= 17 ? true : false;

            await wait(2000);

            await rep.edit({
                content: `# ...
${diceEmoji[x1]} ${diceEmoji[7]} ${diceEmoji[7]}

ID Phiên: \`sessionIdComingSoon\`
Người tạo: <@!${ct.author.id}>`, components: []
            });

            await wait(1000);

            await rep.edit({
                content: `# ...
${diceEmoji[x1]} ${diceEmoji[x2]} ${diceEmoji[7]}

ID Phiên: \`sessionIdComingSoon\`
Người tạo: <@!${ct.author.id}>`, components: []
            });

            await wait(1000);

            await rep.edit({
                content: `# ...
${diceEmoji[x1]} ${diceEmoji[x2]} ${diceEmoji[x3]}

ID Phiên: \`sessionIdComingSoon\`
Người tạo: <@!${ct.author.id}>`, components: []
            });

            await wait(500);

            await rep.edit({
                content: `# ${resSession ? "TÀI" : "XỈU"}
${diceEmoji[x1]} ${diceEmoji[x2]} ${diceEmoji[x3]}

ID Phiên: \`sessionIdComingSoon\`
Người tạo: <@!${ct.author.id}>`, components: []
            });

        }

    }
}

export default evt;