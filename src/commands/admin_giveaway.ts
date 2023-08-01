import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import client from "../client.js";

const command = {
    data: new SlashCommandBuilder()
        .setName('admingiveaway')
        .setDescription('[ADMIN] Giveaway')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Nội dung')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('time')
                .setDescription('Thời gian kết thúc, định dạng: HH:II:SS D-M-Y, ví dụ 10:20:30 20-01-2023')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Emoji để react, ví dụ: :BellBag:')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {


        await interaction.reply({ content: 'OK!', ephemeral: true })
    }
}

export default command;