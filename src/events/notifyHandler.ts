import { ActionRowBuilder, EmbedBuilder, Events, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

import botHandle from "../index.js";

const evt = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.customId === 'notifyCreator') {
            const notifyContent = interaction.fields.getTextInputValue('notifyContent');
            const notifyImage = interaction.fields.getTextInputValue('notifyImage');
            const notifyTitle = interaction.fields.getTextInputValue('notifyTitle');
            const notifySideColor = interaction.fields.getTextInputValue('notifySideColor');
            const notifyIdChannel = interaction.fields.getTextInputValue('notifyIdChannel');

            const embed = new EmbedBuilder()
                .setTitle(notifyTitle)
                .setDescription(notifyContent)
                .setColor(notifySideColor)
                .setFooter({
                    text: "Ảo Ảnh Xanh - with love 100% from nekomimi",
                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                })
                .setTimestamp();

            if (String(notifyImage).length > 1) {
                try {
                    new URL(String(notifyImage));
                    embed.setImage(notifyImage)
                } catch (err) {
                    await interaction.reply({ content: `Lỗi: Liên kết không đúng định dạng!\n\nLiên kết bạn đã gửi:\n\`\`\`${notifyImage}\n\`\`\`\n\nCụ thể:\n\`\`\`${err}\n\`\`\`` });
                    return;
                }

            }

            const channel = botHandle.channels.cache.get(notifyIdChannel);

            //@ts-ignore
            await channel.send({ embeds: [embed] });

            await interaction.reply({ content: 'Đã đăng thông báo thành công!' });
        }
    }
}

export default evt;