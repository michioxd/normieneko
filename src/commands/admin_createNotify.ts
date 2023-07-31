import { ActionRowBuilder, ModalBuilder, PermissionFlagsBits, SlashCommandBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

const command = {
    data: new SlashCommandBuilder()
        .setName('admincreatenotify')
        .setDescription('[ADMIN] Tạo thông báo')
        .addStringOption(option =>
            option.setName('channel')
                .setDescription('Chọn kênh để gửi thông báo')
                .setRequired(true)
                .addChoices(
                    { name: 'Thông báo', value: '1131256611504140389' },
                    { name: 'Donate info', value: '1134918764127846501' },
                    { name: 'Donater', value: '1134918883279646851' }
                ))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        const modal = new ModalBuilder()
            .setCustomId('notifyCreator')
            .setTitle('Tạo thông báo');
        const notifySideColor = new TextInputBuilder()
            .setCustomId('notifySideColor')
            .setLabel("Mã màu (HEX)")
            .setPlaceholder('Mã màu ở định dạng hex, mặc định #32a852')
            .setValue('#32a852')
            .setMinLength(1)
            .setStyle(TextInputStyle.Short);

        const notifyTitle = new TextInputBuilder()
            .setCustomId('notifyTitle')
            .setLabel("Tiêu đề thông báo")
            .setPlaceholder('Nhập tiêu đề thông báo vào đây, ít nhất trên 1 ký tự')
            .setMinLength(1)
            .setStyle(TextInputStyle.Short);

        const notifyContent = new TextInputBuilder()
            .setCustomId('notifyContent')
            .setLabel("Nội dung thông báo")
            .setPlaceholder('Nhập nội dung thông báo vào đây, ít nhất trên 1 ký tự')
            .setMinLength(1)
            .setStyle(TextInputStyle.Paragraph);

        const notifyImage = new TextInputBuilder()
            .setCustomId('notifyImage')
            .setLabel("Liên kết (Link) hình ảnh")
            .setPlaceholder('Nhập URL 1 ảnh bất kỳ, không bắt buộc')
            .setMinLength(1)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(false);
        const notifyIdChannel = new TextInputBuilder()
            .setCustomId('notifyIdChannel')
            .setLabel("ID Channel (cứ để nguyên)")
            .setPlaceholder('ID Channel muốn gửi, để nguyên nếu đã chọn bằng lệnh')
            .setValue(interaction.options.getString('channel'))
            .setMinLength(1)
            .setStyle(TextInputStyle.Paragraph);

        const s1 = new ActionRowBuilder().addComponents(notifyTitle);
        const s2 = new ActionRowBuilder().addComponents(notifyContent);
        const s3 = new ActionRowBuilder().addComponents(notifySideColor);
        const s4 = new ActionRowBuilder().addComponents(notifyImage);
        const s5 = new ActionRowBuilder().addComponents(notifyIdChannel);

        //@ts-ignore
        modal.addComponents(s1, s2, s3, s4, s5);

        await interaction.showModal(modal);
    }
}

export default command;