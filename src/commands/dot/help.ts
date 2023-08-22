import { EmbedBuilder, Events, Message } from "discord.js";

import { globalPrefix } from "../../index.js";
import { emotion } from "./emotion.js";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0] === "help" || msg[0] === "deobietdung" || msg[0] === "cuu" || msg[0] === "cuunan" || msg[0] === "dungnhunao") {

            let emotionList = "`love`, ";
            emotion.map(d => {
                emotionList += "`" + d.name + "`, ";
            });

            const embed = new EmbedBuilder()
                .setDescription(`## Trung tâm cứu hộ cứu nạn Ảo Ảnh Xanh
Thuộc Viện Hàng Lâm Khoa Học **Ảo Ảnh Xanh**
**Prefix của bot là: \`;\`** *(dấu chấm phẩy)*

### Cách lệnh hiện có:
**Cảm xúc, hành động: **
${emotionList}
*Cách dùng: \`;<lệnh> <tag đối tượng vào đây>\`*

**Lệnh khác: **
\`/sinhnhat <ngày> <tháng> <năm>\`: Thiết lập ngày sinh trên server Ảo Ảnh Xanh, sẽ có cái gì đấy đặc biệt khi đến ngày đó :)) [UNSTABLE/PREVIEW]

Hết cmnr
*made with :heart: (love) by \`@michioxd\` from nekomimi lover!*`)
                .setColor("Random");

            ct.reply({
                embeds: [embed]
            })
        }

    }
}

export default evt;