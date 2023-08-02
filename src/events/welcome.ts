import { Events, GuildMember } from "discord.js";

import botHandle from "../index.js";

const evt = {
    name: Events.GuildMemberAdd,
    once: false,
    execute: async (mem) => {
        const channel = botHandle.channels.cache.get('1126875841377353798');

        const memId = mem.id;

        //@ts-ignore
        await channel.send(`Chào mừng bạn <@!${memId}> đã đến với sivi ||${Math.round(Math.random()) > 0 ? "trẩu" : "rách"}|| này\nđám <@&1132926013958008842> dậy gáy coi\nhttps://cdn.discordapp.com/attachments/1126875841377353798/1136259348985815090/59871237-BDA9-45D0-976A-A5094B9F53E1.jpg`);
    }
}

export default evt;