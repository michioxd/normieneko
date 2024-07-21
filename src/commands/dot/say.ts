import { ChannelType, Events, Message, PermissionFlagsBits, PermissionsBitField } from "discord.js";

import { emotion } from "./emotion.js";
import cfg from "../../config.js";
import client from "../../client.js";

const sayLastContent = {
    content: "",
    author: "",
    authorName: "",
    authorAvatar: "",
    messageId: "",
    date: 0
};


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
                ct.reply("**Cách dùng:** `;say <nội dung>` hoặc `;s <nội dung>`");
                return;
            }

            sayLastContent.content = message;
            sayLastContent.messageId = ct.id;
            sayLastContent.author = ct.author.id;
            sayLastContent.authorName = ct.author.displayName;
            sayLastContent.authorAvatar = ct.author.avatarURL({ forceStatic: true });
            sayLastContent.date = Date.now();

            const channel = client.guilds.cache.get(cfg.serverId).channels.cache.get(ct.channelId);
            if (channel) {
                if (ct.deletable) {
                    await ct.delete();
                }
                //@ts-ignore
                await channel.send(message);
            }
        } else if (msg[0] === "whosaid") {
            if (!ct.member.permissionsIn(ct.channelId).has(PermissionFlagsBits.Administrator)) {
                await ct.reply("⛔ Bạn không có quyền sử dụng lệnh này!");
                return;
            }
            if (sayLastContent.content === "") {
                await ct.reply("⛔ Không có ai gửi gần đây hết!");
            } else {
                await ct.reply({
                    embeds: [{
                        author: {
                            name: sayLastContent.authorName,
                            url: "https://discord.com/users/" + sayLastContent.author,
                            icon_url: sayLastContent.authorAvatar,
                        },
                        description: "```\n" + sayLastContent.content + "\n```\nĐã sử dụng lệnh `;say` (`;s`) để gửi tin nhắn bởi **<@!" + sayLastContent.author + ">** vào lúc **" + (new Date(sayLastContent.date).toLocaleString("vi-VN")) + "**\nMessage ID: `" + sayLastContent.messageId + "` | User ID: `" + sayLastContent.author + "`",
                        footer: {
                            text: "BÚN GREEN",
                            icon_url: "https://cdn.discordapp.com/icons/1126875840936955934/b663c39f29807922215044d69a0d0697.webp"
                        }
                    }]
                });
            }
        }

    }
}

export default evt;