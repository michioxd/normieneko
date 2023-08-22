import { EmbedBuilder, Events, Message } from "discord.js";

import { globalPrefix } from "../../index.js";

import client from "../../client.js";
import log from "../../utils/logger.js";
import sharp from "sharp";
import axios from "axios";

const evt = {
    name: Events.MessageCreate,
    once: false,
    execute: async (ct: Message) => {
        // we will prevent it simbot channel
        if (ct.channelId === "1139181936053583904") return;

        if (!ct.content.startsWith(globalPrefix)) return;

        const msg = ct.content.slice(1, ct.content.length).split(" ");

        if (msg[0].toLowerCase() === "love") {

            if (!msg[1]) {
                ct.reply("***Lỗi:** Vui lòng tag 1 ai đó vào đây!*");
                return;
            }

            if (!msg[1].match(/<@!?(\d+)>/)) {
                ct.reply("***Lỗi:** Người dùng được tag không đúng định dạng!*");
                return;
            }

            const userId = msg[1].match(/<@!?(\d+)>/)[1];

            const randomPercent = Math.floor(Math.random() * 100) + 1;

            try {
                const user2nd = await client.users.fetch(userId);

                const image1Path = (await axios({ url: ct.author.avatarURL(), responseType: "arraybuffer" })).data;
                const image2Path = (await axios({ url: user2nd.avatarURL(), responseType: "arraybuffer" })).data;

                const image1 = await sharp(image1Path).resize(200, 200).toBuffer();
                const image2 = await sharp(image2Path).resize(200, 200).toBuffer();

                const heart = await sharp("./assets/heart.png")
                    .composite([
                        {
                            input: Buffer.from(
                                `<svg width="200" height="200"><text x="50%" y="55%" font-size="45" fill="#fff" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${randomPercent}%</text></svg>`
                            )
                        }
                    ])
                    .toBuffer();


                const output = await sharp({
                    create: {
                        width: 200 * 3,
                        height: 200 + 50,
                        channels: 4,
                        background: {
                            r: 0,
                            g: 0,
                            b: 0,
                            alpha: 0
                        }
                    }
                }).composite([
                    { input: image1, left: 0, top: 0 },
                    { input: heart, left: 200, top: 0 },
                    { input: image2, left: 400, top: 0 },
                    {
                        input: Buffer.from(
                            `<svg width="200" height="50"><text x="50%" y="50%" font-size="12" fill="#57FF70" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${ct.author.displayName}</text></svg>`
                        ),
                        left: 0,
                        top: 200
                    },
                    {
                        input: Buffer.from(
                            `<svg width="200" height="50">
                <text x="50%" y="50%" font-size="18" fill="#57FF70" font-family="Google Sans" font-weight="bold" dominant-baseline="middle" text-anchor="middle">Ảo Ảnh Xanh</text>
                </svg>`
                        ),
                        left: 200,
                        top: 200
                    },
                    {
                        input: Buffer.from(
                            `<svg width="200" height="50"><text x="50%" y="50%" font-size="12" fill="#57FF70" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${user2nd.displayName}</text></svg>`
                        ),
                        left: 400,
                        top: 200
                    }
                ]).toFormat('png').toBuffer();

                const channel = client.channels.cache.get(ct.channelId);

                //@ts-ignore
                channel.send({
                    content: `# <@!${ct.author.id}> :heart: ${randomPercent}% :heart: <@!${user2nd.id}>\n*${randomPercent < 30
                        ? "Những ánh mắt lướt qua chỉ là sự tình cờ, nhưng trong tim tôi, em đã khắc sâu."
                        : randomPercent < 60
                            ? "Những nụ cười ngại ngùng là dấu hiệu của tình cảm bắt đầu nảy mầm."
                            : randomPercent < 99
                                ? "Cuộc sống không còn đơn độc khi có ai đó đặc biệt bước vào, điểm chấm dứt cho mọi khoảnh khắc."
                                : "Em không chỉ là nửa còn lại, mà em chính là sự hoàn thiện của cuộc đời tôi."
                        }*`,
                    files: [output]
                });

            } catch (e) {
                ct.reply("***Lỗi:** Không thể lấy thông tin người dùng!*");
                log({
                    type: 3,
                    message: "Cannot fetch user id: " + e
                });
            }


        }

    }
}

export default evt;