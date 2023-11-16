import { ButtonBuilder, Channel, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonStyle, ActionRowBuilder } from "discord.js";
import client from "../client.js";
import { Giveaway, GiveawayJoined } from "../db.js";
import log from "../utils/logger.js";
import { Sequelize } from "sequelize";
import crypto from "crypto";

const command = {
    data: new SlashCommandBuilder()
        .setName('admingiveaway')
        .setDescription('[ADMIN] Giveaway')
        .addStringOption(option =>
            option.setName('content')
                .setDescription('Nội dung')
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('Thời gian kết thúc, định dạng giây, ví dụ 10 = 10 giây, 20 = 20 giây, 300 = 5 phút, 3600 = 1 tiếng')
                .setMinValue(1)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count')
                .setDescription('Số người có thể tham gia, 0 = không giới hạn')
                .setMinValue(0)
                .setRequired(true))
        .addIntegerOption(option =>
            option.setName('count_winners')
                .setDescription('Số người được giải, >= 1')
                .setMinValue(1)
                .setRequired(true))
        .addBooleanOption(option => option.setName("ping_ga").setRequired(true)
            .setDescription("Ping role Ping GA"))
        .addStringOption(option =>
            option.setName("channel")
                .setChoices({
                    name: "Giveaway", value: "1131256754420854854"
                })
                .setDescription("Kênh để gửi GA"))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const channel = client.channels.cache.get(interaction.options.getString('channel') ?? '1131256754420854854');

        //@ts-ignore
        channel.sendTyping();

        const guid = crypto.randomUUID();
        const randomEmoji = Math.random() < 0.5 ? '🎉' : Math.random() < 0.5 ? '🥳' : Math.random() < 0.5 ? '👏' : Math.random() < 0.5 ? '✨' : Math.random() < 0.5 ? '🙌' : Math.random() < 0.5 ? '🎊' : '💐🏆';
        const currentTime = Date.now();
        const content = interaction.options.getString('content');
        const winners = interaction.options.getInteger('count_winners');
        const joiners = interaction.options.getInteger('joiners');
        const expireTime = interaction.options.getInteger('time');
        const expired = currentTime + expireTime * 1000;

        const embed = new EmbedBuilder()
            .setTitle(content)
            .setDescription(`**Kết thúc vào:** ${(new Date(expired).toLocaleString('vi-VN'))}\n**Số người có thể tham gia:** ${joiners > 0 ? joiners : "Không giới hạn"}\n**Đã tham gia**: 0\n**Thắng:** ${winners}\n\n*Nhấn nút phía dưới để tham gia, nếu đã tham gia, nhấn thêm 1 lần nữa để huỷ!*`)
            .setColor("#44ff00")
            .setFooter({
                text: "Ảo Ảnh Xanh Giveaway",
                iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
            })
            .setTimestamp();

        const confirm = new ButtonBuilder()
            .setCustomId('confirmGA')
            .setLabel(randomEmoji)
            .setStyle(ButtonStyle.Success);
        const refresh = new ButtonBuilder()
            .setCustomId('refreshGA')
            .setLabel("🔄 Làm mới")
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(confirm)
            .addComponents(refresh);

        try {
            await Giveaway.create({
                uuid: guid,
                createdBy: interaction.user.id,
                expired: expired,
                maxUser: joiners,
                done: 0
            });
            if (interaction.options.getBoolean('ping_ga')) {
                //@ts-ignore
                await channel.send("<@&1134094996912476285>");
            }
            //@ts-ignore
            const response = await channel.send({
                embeds: [embed],
                components: [row],
            });

            await interaction.reply({ content: '**Đã tạo GA thành công!**\nUUID: `' + guid + '`' });

            let ok = false;

            while (!ok) {
                if (ok) return;
                try {
                    const GA = await Giveaway.findOne({ where: { uuid: guid } });
                    if (GA !== null) {
                        if (GA.expired - Date.now() > 0) {
                            try {
                                const cfm = await response.awaitMessageComponent({ time: 3000 });
                                if (cfm.customId === 'confirmGA') {
                                    try {
                                        const GA_Join = await GiveawayJoined.findOne({ where: { gaUuid: guid, uid: cfm.user.id } });
                                        if (GA_Join === null) {
                                            await GiveawayJoined.create({
                                                uid: cfm.user.id,
                                                joinedAt: Date.now(),
                                                gaUuid: guid,
                                                uuid: crypto.randomUUID()
                                            });

                                            const joinedLen = await GiveawayJoined.count({ where: { gaUuid: guid } });
                                            const updateEmbed = new EmbedBuilder()
                                                .setTitle(content)
                                                .setDescription(`**Kết thúc vào:** ${(new Date(expired).toLocaleString('vi-VN'))}\n**Số người có thể tham gia:** ${joiners > 0 ? joiners : "Không giới hạn"}\n**Đã tham gia**: ${joinedLen}\n**Thắng:** ${winners}\n\n*Nhấn nút phía dưới để tham gia, nếu đã tham gia, nhấn thêm 1 lần nữa để huỷ!*`)
                                                .setColor("#44ff00")
                                                .setFooter({
                                                    text: "Ảo Ảnh Xanh Giveaway",
                                                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                                                })
                                                .setTimestamp();

                                            cfm.update({
                                                embeds: [updateEmbed]
                                            });
                                            client.users.cache.get(cfm.user.id).send("✅ Bạn đã tham gia Giveaway **" + content + "** của ngày " + (new Date(expired).toLocaleString('vi-VN')));
                                        } else {
                                            await GiveawayJoined.destroy({
                                                where: { gaUuid: guid, uid: cfm.user.id }
                                            });
                                            const joinedLen = await GiveawayJoined.count({ where: { gaUuid: guid } });
                                            const updateEmbed = new EmbedBuilder()
                                                .setTitle(content)
                                                .setDescription(`**Kết thúc vào:** ${(new Date(expired).toLocaleString('vi-VN'))}\n**Số người có thể tham gia:** ${joiners > 0 ? joiners : "Không giới hạn"}\n**Đã tham gia**: ${joinedLen}\n**Thắng:** ${winners}\n\n*Nhấn nút phía dưới để tham gia, nếu đã tham gia, nhấn thêm 1 lần nữa để huỷ!*`)
                                                .setColor("#44ff00")
                                                .setFooter({
                                                    text: "Ảo Ảnh Xanh Giveaway",
                                                    iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                                                })
                                                .setTimestamp();

                                            cfm.update({
                                                embeds: [updateEmbed]
                                            });
                                            client.users.cache.get(cfm.user.id).send("❌ Bạn đã huỷ tham gia Giveaway **" + content + "** của ngày " + (new Date(expired).toLocaleString('vi-VN')));
                                        }
                                    } catch (e) {
                                        client.users.cache.get(cfm.user.id).send("❌ Đã có lỗi xảy ra khi tham gia Giveaway!");

                                        log({
                                            type: 3,
                                            message: "Error while joining GA: " + e
                                        });
                                    }
                                } else {
                                    const joinedLen = await GiveawayJoined.count({ where: { gaUuid: guid } });
                                    const updateEmbed = new EmbedBuilder()
                                        .setTitle(content)
                                        .setDescription(`**Kết thúc vào:** ${(new Date(expired).toLocaleString('vi-VN'))}\n**Số người có thể tham gia:** ${joiners > 0 ? joiners : "Không giới hạn"}\n**Đã tham gia**: ${joinedLen}\n**Thắng:** ${winners}\n\n*Nhấn nút phía dưới để tham gia, nếu đã tham gia, nhấn thêm 1 lần nữa để huỷ!*`)
                                        .setColor("#44ff00")
                                        .setFooter({
                                            text: "Ảo Ảnh Xanh Giveaway",
                                            iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                                        })
                                        .setTimestamp();

                                    cfm.update({
                                        embeds: [updateEmbed]
                                    });
                                }
                            } catch (e) { }
                        } else {
                            try {
                                const GA_Join = await GiveawayJoined.findAll({ order: Sequelize.literal('RANDOM()'), limit: winners, where: { gaUuid: guid } });
                                const joinedLen = await GiveawayJoined.count({ where: { gaUuid: guid } });
                                let resultGA = "", resultGACong;
                                GA_Join.map((d, i) => {
                                    client.users.cache.get(d.uid).send("## 🎉 Chúc mừng bạn đã trúng Giveaway **" + content + "** của ngày " + (new Date(expired).toLocaleString('vi-VN')) + "\n### Bạn vui lòng hãy liên hệ tới Owner của server **Ảo Ảnh Xanh** để nhận giải!!!\nUUID Xác nhận tham gia: `" + d.uuid + "`");
                                    resultGA += ((i + 1) + ". <@!" + d.uid + ">\n");
                                });
                                await Giveaway.update({ done: 1 }, { where: { uuid: guid } });

                                const ResultEmbed = new EmbedBuilder()
                                    .setTitle("[ĐÃ KẾT THÚC] " + content)
                                    .setDescription(`**🎉 Người trúng Giveaway**:\n${resultGA ? resultGA : "*Không có ai trúng Giveaway :(*"}\n*Những người thắng Giveaway xin vui lòng kiểm tra DMs của bot đã gửi tới bạn!*\n\n**Kết thúc vào:** ${(new Date(expired).toLocaleString('vi-VN'))}\n**Số người có thể tham gia:** ${joiners > 0 ? joiners : "Không giới hạn"}\n**Đã tham gia**: ${joinedLen}\n**Thắng:** ${winners}`)
                                    .setColor("#44ff00")
                                    .setFooter({
                                        text: "Ảo Ảnh Xanh Giveaway",
                                        iconURL: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png",
                                    })
                                    .setTimestamp();

                                await response.edit({
                                    embeds: [ResultEmbed],
                                    components: []
                                });
                            } catch (e) {

                            }
                            ok = true;
                        }
                    } else {
                        log({
                            type: 3,
                            message: "Cannot find Giveaway"
                        });
                        ok = true;
                    }
                } catch (e) {
                    log({
                        type: 3,
                        message: "Error while finding GA: " + e
                    });
                    ok = true;
                }
            }

        } catch (e) {
            await interaction.reply({ content: 'Không thể tạo GA do lỗi kỹ thuật!\n```\n' + e + "\n```" });
        }
    }
}

export default command;