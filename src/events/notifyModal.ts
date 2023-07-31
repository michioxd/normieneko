import { ActionRowBuilder, Events, GuildMember, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

import botHandle from "../index.js";

const evt = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction) => {
        if (!interaction.isChatInputCommand()) return;

        if (interaction.commandName === 'admincreatenotify') {
            const modal = new ModalBuilder()
                .setCustomId('notifyCreator')
                .setTitle('Tạo thông báo');

            const notifyContent = new TextInputBuilder()
                .setCustomId('notifyContent')
                .setLabel("Nội dung thông báo")
                .setPlaceholder('Nhập nội dung thông báo vào đây, ít nhất trên 1 ký tự')
                .setMinLength(1)
                .setStyle(TextInputStyle.Paragraph);

            const firstActionRow = new ActionRowBuilder().addComponents(notifyContent);

            //@ts-ignore
            modal.addComponents(firstActionRow);

            await interaction.showModal(modal);
        }
    }
}

export default evt;