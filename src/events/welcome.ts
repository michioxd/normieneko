import { Events } from "discord.js";
import { readFile } from "node:fs/promises";

import botHandle from "../index.js";

const evt = {
    name: Events.GuildMemberAdd,
    once: false,
    execute: async (mem) => {
        const channel = botHandle.channels.cache.get('1126875841377353798');

        const memId = mem.id;

        const messageContent = `Chào mừng bạn **<@!${memId}>** đã đến với sivi chuyên ***đập mọi loại đá*** theo **tiêu chuẩn châu á ISO 9001:2023**\nBạn **đập đá** là niềm **vinh hạnh** của toàn thể **đáer** chúng tôi.\nđám <@&1132926013958008842> dậy gáy coi`;

        try {
            const imageBuffer = await readFile('./assets/welcome.jpg');

            //@ts-ignore
            await channel.send({ content: messageContent, files: [imageBuffer] });
        } catch (error) {
            console.error('[ERROR] Cannot get image:', error);
            //@ts-ignore
            await channel.send(messageContent);
        }
    }
}

export default evt;