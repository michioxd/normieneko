import { EmbedBuilder, Events, Message } from "discord.js";
import log from "../../utils/logger.js";
import client from "../../client.js";
import { EmotionType } from "../../types.js";
import cfg from "../../config.js";

const baseFolder: string = "./gif/";

export const emotion: EmotionType[] = [
    {
        name: "bonk",
        text: "[[FROM]] đã gõ bay đầu [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119844833763348/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119845701988394/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119846360485959/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119846767341598/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119847199346818/5.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119847715250256/6.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119848218562600/7.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143119848751243326/8.gif"
        ],
        color: "#e3cf1b"
    },
    {
        name: "hug",
        text: "[[FROM]] đã trao cái ôm nồng thắm dành cho [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120666258833428/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120666611175464/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120666976075826/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120667366129685/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120667743637634/5.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120668087566386/6.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120668456648764/7.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120668834156624/8.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120669182279730/9.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143120669618470993/10.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143121328539451392/11.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143121328904360056/12.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143121329306992640/13.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143121329701273680/14.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143121330057793587/15.gif"
        ],
        color: "#db1aab"
    },
    {
        name: "kill",
        text: "[[FROM]] đã ~~giết~~ [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143121945278283856/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143153290184511540/10A5211F-83AD-4166-A5DA-8AF3F533ADFD.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143153290612310147/6C1C97C0-7AC6-42F3-B266-341B3F757EEC.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143153291027554365/43416FAD-8F66-4E4D-A396-9FEDB7D490E8.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143153291505717278/34AFE5B8-120E-45BD-9CE3-521F92A6BCF9.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143153291866406942/5A452C80-6B72-4FA5-826B-46BABA9E0075.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143153292231315526/12A55C59-3C1B-4C30-B306-044E543EFA4F.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143158067773571083/CD09ACE3-C693-4747-A5F6-6D5301915480.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143158068142690384/DE73C54F-23D6-4547-AEDB-4A9EF706EDC1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143158068591476767/2DE5A7EA-6F4B-4501-8260-7E72496C0F9F.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143158068968947723/6B11BF33-11DE-4243-AFF6-BBB651F51DEA.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143158069518422016/3CE1043D-AF0D-44F3-9FA4-55BE7BDF58B3.gif",
            ""
        ],
        color: "#de1b1b"
    },
    {
        name: "kiss",
        text: "[[FROM]] đã hôn [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122120394682388/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122120906391685/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122121275474010/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122121673945088/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122122235986010/5.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122122781229066/6.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122123490078821/7.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122123892719636/8.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122124345720862/9.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122124714803300/10.gif"
        ],
        color: "#a71bde"
    },
    {
        name: "lick",
        text: "[[FROM]] đã liếm [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122816389095444/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122816896614430/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122817295077437/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122817659969536/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143122818050048070/5.gif"
        ],
        color: "#1b2bde"
    },
    {
        name: "pat",
        text: "[[FROM]] đã xoa đầu [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123588816322642/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123589248319508/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123589730685096/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123590129139762/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123590569525360/5.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123591093829652/6.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123591483883690/7.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123591924301944/8.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123592528285799/9.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123592972861570/10.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123785411723384/11.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123785759862834/12.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123786116382770/13.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123786531602543/14.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123786883936306/16.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123787253039185/17.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123787617927178/18.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123787945095268/19.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143123788335169606/20.gif"
        ],
        color: "#1bd8de"
    },
    {
        name: "punch",
        text: "[[FROM]] đã đấm [[TO]] cho bay màu",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135197127266325/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135197928357949/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135198364569672/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135198930817034/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135199325061162/5.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135200138760393/6.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135200814039050/7.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143135201413845002/8.gif"
        ],
        color: "NotQuiteBlack"
    },
    {
        name: "slap",
        text: "[[FROM]] đã tát vỡ mõm [[TO]]",
        image: [
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124639145541683/1.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124639460110439/2.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124639816634438/3.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124640202506340/4.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124640638709840/5.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124641058148403/6.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124641494351955/7.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124641901195354/8.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124642358382662/9.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143124642744250398/10.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143125320778657863/11.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143125321386840124/12.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143125321936285826/13.gif",
            "https://cdn.discordapp.com/attachments/1131254507918082280/1143160525342113863/9009A464-C42E-41B2-B9D8-936374F2D2AF.gif"
        ],
        color: "#1bde25"
    },
];

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(cfg.globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        const pos = emotion.findIndex(e => e.name === msg[0].toLowerCase());

        if (pos > -1) {

            if (!msg[1]) {
                ct.reply("***Lỗi:** Vui lòng tag 1 ai đó vào đây!*");
                return;
            }

            if (!msg[1].match(/<@!?(\d+)>/)) {
                ct.reply("***Lỗi:** Người dùng được tag không đúng định dạng!*");
                return;
            }

            const userId = msg[1].match(/<@!?(\d+)>/)[1];

            if (userId === ct.author.id) {
                ct.reply("*Bạn không thể làm thế với chính mình!*");
                return;
            }

            const channel = client.channels.cache.get(ct.channelId);

            const emot = emotion[pos];

            const sendContent = emot.text
                .replace("[[FROM]]", `<@!${ct.author.id}>`)
                .replace("[[TO]]", `<@!${userId}>`);

            const embed = new EmbedBuilder()
                .setDescription(sendContent)
                .setImage(emot.image[
                    Math.floor(Math.random() * emot.image.length)
                ])
                .setColor(emot.color)
                .setFooter({ text: ct.author.displayName, iconURL: ct.author.avatarURL() });

            try {
                //@ts-ignore
                await channel.send({ embeds: [embed] });
            } catch (e) {
                ct.reply("Lỗi không xác định, vui lòng thử lại sau!");
                log({
                    type: 3,
                    message: "Cannot send emotion: " + e
                })
                return;
            }
        }
    }
}

export default evt;