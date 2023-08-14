import { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import type { CommandInteraction } from "discord.js";
import client from "../client.js";
import { User } from "../db.js";
import log from "../utils/logger.js";
import { UserType } from "../types.js";

const command = {
    data: new SlashCommandBuilder()
        .setName('sinhnhat')
        .setDescription('Thiết lập ngày sinh nhật của bạn. Sẽ có một cái gì đấy khi tới lúc đấy :))')
        .addIntegerOption(option =>
            option.setName('ngay')
                .setDescription('Ngày (1-31)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('thang')
                .setDescription('Tháng (1-12)')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('nam')
                .setDescription('Năm (1980 - 2023)')
                .setRequired(true)),
    async execute(interaction) {

        try {
            const userInjected = await User.findOne({ where: { uid: interaction.member.id } }) instanceof User;

            if (userInjected) {
                interaction.reply({
                    content: "**Lỗi:** Bạn không thể chỉnh sửa ngày sinh nhật của mình được nữa!",
                    ephemeral: true
                });

                return;
            }
        } catch (e) {
            log({
                type: 3,
                message: `Cannot find user birthday data. UserID: ${interaction.member.id} Error: ${e}`
            });
            interaction.reply({
                content: "**Lỗi:** Đã xảy ra lỗi kỹ thuật, vui lòng thử lại sau!",
                ephemeral: true
            });
            return;
        }

        const days = interaction.options.getInteger('ngay');
        const months = interaction.options.getInteger('thang');
        const years = interaction.options.getInteger('nam');

        if (days < 1 || days > 31) {
            interaction.reply({
                content: "**Lỗi:** Ngày sinh chỉ ở trong giới hạn từ 1 đến 31.",
                ephemeral: true
            });

            return;
        }

        if (months < 1 || months > 12) {
            interaction.reply({
                content: "**Lỗi:** Tháng sinh chỉ ở trong giới hạn từ 1 đến 31.",
                ephemeral: true
            });

            return;
        }

        if (years < 1980 || years > 2023) {
            interaction.reply({
                content: "**Lỗi:** Năm sinh chỉ ở trong giới hạn từ 1980 đến 2023.",
                ephemeral: true
            });

            return;
        }

        const confirm = new ButtonBuilder()
            .setCustomId('birthday_confirm')
            .setLabel('Xác nhận')
            .setStyle(ButtonStyle.Success);

        const cancel = new ButtonBuilder()
            .setCustomId('birthday_cancel')
            .setLabel('Huỷ')
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder()
            .addComponents(cancel, confirm);

        const response = await interaction.reply({
            content: `<:aax_cat_chinchon:1132691523805392968> Ê ê <@!${interaction.member.id}>, bạn đang sử dụng lệnh đặt ngày sinh và bạn đang đặt ngày sinh của bạn là **${(days < 10 ? "0" + days : days)}/${(months < 10 ? "0" + months : months)}/${years}**.\n**Xin lưu ý:** Một khi bạn đã đặt thì sẽ **không thể thay đổi lại được**, hãy nhấn các nút ở phía dưới để xác nhận.\nQuá trình này sẽ bị huỷ bỏ trong vòng 1 phút kể từ khi bạn yêu cầu lệnh này!`,
            components: [row],
            ephemeral: true
        });

        const collectorFilter = i => i.user.id === interaction.user.id;

        try {
            const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

            if (confirmation.customId === 'birthday_confirm') {

                const build = User.build({
                    uid: interaction.member.id,
                    birthdayDay: days,
                    birthdayMonth: months,
                    birthdayYear: years
                });

                try {
                    await build.save();

                    await confirmation.update({ content: `Ngày sinh đã được đặt, ngày sinh của bạn là **${(days < 10 ? "0" + days : days)}/${(months < 10 ? "0" + months : months)}/${years}**.`, components: [] });
                } catch (e) {
                    log({
                        type: 3,
                        message: `Cannot save user birthday data. UserID: ${interaction.member.id} UserInputBirthday: ${(days < 10 ? "0" + days : days)}/${(months < 10 ? "0" + months : months)}/${years} Error: ${e}`
                    });
                    await confirmation.update({ content: 'Đã xảy ra lỗi kỹ thuật, không thể lưu dữ liệu, vui lòng thử lại sau!', components: [] });
                }

            } else if (confirmation.customId === 'birthday_cancel') {
                await confirmation.update({ content: 'Quá trình đã bị huỷ bỏ bởi **bạn**!', components: [] });
            }
        } catch (e) {
            await interaction.editReply({ content: 'Quá trình đã bị huỷ bỏ do quá thời gian chờ (60 giây)', components: [] });
        }

    }
}

export default command;