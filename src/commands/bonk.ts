import { SlashCommandBuilder } from "discord.js";

const command = {
    data: new SlashCommandBuilder()
        .setName('bonk')
        .setDescription('đấm không trượt phát lào')
        .addStringOption(option =>
            option.setName('doi_tuong')
                .setDescription('Lựa chọn đối tượng cần đấm')
                .setRequired(true)
                .addChoices(
                    { name: 'nhy', value: 'nhy' },
                    { name: 'liam', value: 'liam' }
                ))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Số lần đấm bay màu sml (min 1 max 10)')
                .setRequired(true)
        ),
    async execute(interaction) {
        const target = interaction.options.getString('doi_tuong');
        const count = interaction.options.getInteger('count');
        if (target !== 'nhy' && target !== 'liam') {
            await interaction.reply(`Moẹn nqu thế, sai moẹn cú pháp kìa :))`);
        } else if (count < 1 && count > 10) {
            await interaction.reply(`Đấm vừa vừa thôi tội nó :))`);
        } else {
            let res = "";
            for (let i = 0; i < count; i++) {
                res += `${target} nqu vcl, ${target} nqu hết phần thiên hạ, ${target} nqu không ai sánh bằng, nghĩ mà chán\n`;
            }
            await interaction.reply(res);
        }
    }
}

export default command;