import { Events, Message } from "discord.js";

import { emotion } from "./emotion.js";
import cfg from "../../config.js";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(cfg.globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "help" || msg[0] === "deobietdung" || msg[0] === "cuu" || msg[0] === "cuunan" || msg[0] === "dungnhunao") {

            let emotionList = "`love`, ";
            emotion.map(d => {
                emotionList += "`" + d.name + "`, ";
            });

            await ct.reply({
                embeds: [{
                    author: {
                        name: "Trợ giúp - Bot Ảo Ảnh Xanh"
                    },
                    description: "## Trung tâm cứu hộ cứu nạn Ảo Ảnh Xanh\nThuộc Viện Hàng Lâm Khoa Học **Ảo Ảnh Xanh**\n\n↗️ **Prefix của bot là: `;`** *(dấu chấm phẩy)*\n### Các lệnh cơ bản\n**😋 Cảm xúc, hành động: **\n\n*Cách dùng: `;<lệnh> <tag đối tượng vào đây>`*\n\n**🎲 Cờ bạc trái phép: **\n`taixiu`\n### 🎧  Nghe nhạc [THỬ NGHIỆM - ĐANG TRONG QUÁ TRÌNH PHÁT TRIỂN]\n**⚠️ Lưu ý:** Bạn cần vào một voice channel bất kỳ trước khi dùng lệnh nghe nhạc dưới đây!!!\n`;play` Tiếp tục phát nhạc đã thêm trong hàng chờ.\n`;play <từ khoá tìm kiếm>` Phát nhạc bằng cách tìm kiếm 1 từ khoá, video đầu tiên của từ khoá đấy trên YouTube sẽ được phát\n`;play <liên kết video/track/playlist>` Phát nhạc từ liên kết video/track/playlist trên YouTube hoặc Spotify.\n`;skip` Bỏ qua bài hiện tại\n`;stop` Dừng và thoát\n`;stop clear` Dừng và thoát và xoá tất cả trong hàng chờ\n`;queue` Danh sách hàng chờ\n`;queue clear` Xoá tất cả bài đã thêm trong hàng chờ\n`;queue <số trang>` Đi tới trang bao nhiêu trong hàng chờ\n\n**Ví dụ**\n- Bạn có keyword muốn tìm kiếm để phát là *never gonna give you up*\n`;play never gonna give you up`\n- Để phát 1 bài hát bất kỳ từ link YouTube\n`;play https://youtu.be/dQw4w9WgXcQ`\n- Trong hàng chờ vẫn có bài hát, nhưng đã dừng lại trước đó mà bây giờ muốn tiếp tục phát\n`;play`\n- Trong hàng chờ có **5** trang mà muốn đi tới trang thứ **2**\n`;queue 2`\n\nTrong tương lai sẽ update thêm :v\n\n**made with :heart: (love) by `@michioxd` (a.k.a neko) from nekomimi lover!**",
                    footer: {
                        text: "Ảo Ảnh Xanh",
                        icon_url: "https://cdn.discordapp.com/attachments/1132959792072237138/1135220931472654397/3FA86C9B-C40F-456A-A637-9D6C39EAA38B.png"
                    }
                }]
            });

            //             const embed = new EmbedBuilder()
            //                 .setDescription(`## Trung tâm cứu hộ cứu nạn Ảo Ảnh Xanh
            // Thuộc Viện Hàng Lâm Khoa Học **Ảo Ảnh Xanh**
            // **Prefix của bot là: \`;\`** *(dấu chấm phẩy)*

            // ### Cách lệnh hiện có:
            // **Cảm xúc, hành động: **
            // ${emotionList}
            // *Cách dùng: \`;<lệnh> <tag đối tượng vào đây>\`*

            // **Cờ bạc trái phép: **
            // \`taixiu\`

            // **Lệnh khác: **
            // \`/sinhnhat <ngày> <tháng> <năm>\`: Thiết lập ngày sinh trên server Ảo Ảnh Xanh, sẽ có cái gì đấy đặc biệt khi đến ngày đó :)) [UNSTABLE/PREVIEW]

            // Hết cmnr
            // *made with :heart: (love) by \`@michioxd\` from nekomimi lover!*`)
            //                 .setColor("Random");

            //             ct.reply({
            //                 embeds: [embed]
            //             })
        }

    }
}

export default evt;