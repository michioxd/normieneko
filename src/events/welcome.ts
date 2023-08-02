import { Events, GuildMember } from "discord.js";

import botHandle from "../index.js";

const evt = {
    name: Events.GuildMemberAdd,
    once: false,
    execute: async (mem) => {
        const channel = botHandle.channels.cache.get('1126875841377353798');

        const memId = mem.id;

        //@ts-ignore
        await channel.send(`Chào mừng bạn <@!${memId}> đã đến với sivi ||${Math.round(Math.random()) > 0 ? "trẩu" : "rách"}|| này\nđám <@&1132926013958008842> dậy gáy coi`);
    }
}

export default evt;