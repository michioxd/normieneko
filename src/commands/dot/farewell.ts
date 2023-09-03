import { EmbedBuilder, Events, Message } from "discord.js";

import { globalPrefix } from "../../index.js";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {

        if (!ct.content.startsWith(globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "farewell") {
            const embed = new EmbedBuilder()
                .setDescription(`## Ngừng duy trì bot Ảo Ảnh Xanh

**Neko** (tên mọi người hay gọi / <@!536175851247501347>) sẽ **sủi khỏi đây** và cũng như **ngừng duy trì bot**, cảm ơn tất cả mọi người rất nhiều!

***[ADMIN/STAFF ONLY]***
Nếu ai ở trong staff hoặc admin biết (hoặc muốn) **maintain (hoặc deploy)** thì DMs cho <@!536175851247501347> để được cung cấp **mã nguồn (source code) của bot**. 

Cảm ơn. (From **Michio (michioxd / aka Neko)** love everyone)`)
                .setColor("Random");

            ct.reply({
                embeds: [embed]
            })
        }

    }
}

export default evt;