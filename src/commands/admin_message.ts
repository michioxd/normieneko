import { ActionRowBuilder, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

import botHandle from "../index.js";

const command = {
    data: new SlashCommandBuilder()
        .setName('adminmessage')
        .setDescription('[ADMIN] Nhắn tin')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Nội dung')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('ID Kênh để gửi tin nhắn')
                .setRequired(false))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {

        const channel = botHandle.channels.cache.get(interaction.options.getString('channel') ?? '1126875841377353798');

        //@ts-ignore
        await channel.send(interaction.options.getString('content'));

        await interaction.reply({ content: 'OK!', ephemeral: true })
    }
}

export default command;