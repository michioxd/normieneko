import { SlashCommandBuilder } from "discord.js";

const command = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('lmao lmao'),
    async execute(interaction) {
        await interaction.reply(`\`USER_REQUESTED: ${interaction.user.username}\nJOINED_AT: ${interaction.member.joinedAt}\nREQUEST_DATE: ${Date.now()}\``);
    }
}

export default command;