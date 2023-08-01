import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import client from "../client.js";


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

        const channel = client.channels.cache.get(interaction.options.getString('channel') ?? '1126875841377353798');

        //@ts-ignore
        await channel.send(interaction.options.getString('content'));

        await interaction.reply({ content: 'OK!', ephemeral: true })
    }
}

export default command;