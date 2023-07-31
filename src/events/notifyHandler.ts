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

            if (String(notifyContent).length < 1) {
                await interaction.reply({ content: `**Lỗi**: Giới hạn của nội dung từ 1 đến 4000 ký tự` });
                return;
            }

            if (
                !(/^#([A-Fa-f0-9]{6})$/.test(String(notifySideColor)))
            ) {
                await interaction.reply({ content: `**Lỗi**: Mã màu không đúng định dạng, chỉ chấp nhận ở dạng HEX (#AABBCC)!\n\nMã màu đã gửi:\n\`\`\`\n${String(notifySideColor)}\n\`\`\`\n\nBiểu thức chính quy đang sử dụng:\n\`\`\`\n^#([A-Fa-f0-9]{6})$\n\`\`\`` });
                return;
            }

            const embed = new EmbedBuilder()
                .setTitle(notifyTitle)
                .setDescription(notifyContent)
                .setColor(notifySideColor)
                .setFooter({
                    text: "Ảo Ảnh Xanh",
                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                })
                .setTimestamp();

            if (String(notifyImage).length > 1) {
                try {
                    new URL(String(notifyImage));
                    embed.setImage(notifyImage)
                } catch (err) {
                    await interaction.reply({ content: `**Lỗi**: Liên kết ảnh không đúng định dạng!\n\nLiên kết ảnh đã gửi:\n\`\`\`\n${String(notifyImage)}\n\`\`\`\n\nCụ thể:\n\`\`\`\n${err}\n\`\`\`` });
                    return;
                }

            }

            const channel = botHandle.channels.cache.get(notifyIdChannel);

            //@ts-ignore
            await channel.send({ embeds: [embed] });

            await interaction.reply({ content: '*Đã đăng thông báo thành công!*' });
        }
    }
}

export default evt;