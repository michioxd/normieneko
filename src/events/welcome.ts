import { Events, GuildMember } from "discord.js";

import botHandle from "../index.js";

const evt = {
    name: Events.GuildMemberAdd,
    once: false,
    execute: async (mem) => {
        const channel = botHandle.channels.cache.get('1126875841377353798');

        const memId = mem.id;

        //@ts-ignore
        await channel.send(`Chào bạn <@!${memId}>\nĐã đến vs seve ${Math.round(Math.random()) > 0 ? "trẩu" : "rách"} này`);
    }
}

export default evt;