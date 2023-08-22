import { EmbedBuilder, Events, Message } from "discord.js";
import { readFile } from 'node:fs/promises';

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

                // const image1Path = (await axios({ url: ct.author.avatarURL(), responseType: "arraybuffer" })).data;
                // const image2Path = (await axios({ url: user2nd.avatarURL(), responseType: "arraybuffer" })).data;

                let image1Path, image2Path;

                try {
                    image1Path = (await axios({ url: ct.author.avatarURL(), responseType: "arraybuffer" })).data as Buffer;
                } catch (e) {
                    image1Path = await readFile("./assets/noavatar.png");
                }

                try {
                    image2Path = (await axios({ url: user2nd.avatarURL(), responseType: "arraybuffer" })).data as Buffer;
                } catch (e) {
                    image2Path = await readFile("./assets/noavatar.png");
                }

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
                            `<svg width="200" height="50">
                            <text x="50.5%" y="50.5%" font-size="14" fill="#FFF" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${ct.author.displayName}</text>
                            <text x="50%" y="50%" font-size="14" fill="#57FF70" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${ct.author.displayName}</text>
                            </svg>`
                        ),
                        left: 0,
                        top: 200
                    },
                    {
                        input: Buffer.from(
                            `<svg width="200" height="50">
                            <text x="50.5%" y="50.5%" font-size="20" fill="#FFF" font-family="Google Sans" font-weight="bold" dominant-baseline="middle" text-anchor="middle">Ảo Ảnh Xanh</text>
                            <text x="50%" y="50%" font-size="20" fill="#57FF70" font-family="Google Sans" font-weight="bold" dominant-baseline="middle" text-anchor="middle">Ảo Ảnh Xanh</text>
                            </svg>`
                        ),
                        left: 200,
                        top: 200
                    },
                    {
                        input: Buffer.from(
                            `<svg width="200" height="50">
                            <text x="50.5%" y="50.5%" font-size="14" fill="#FFF" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${user2nd.displayName}</text>
                            <text x="50%" y="50%" font-size="14" fill="#57FF70" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">${user2nd.displayName}</text>
                            </svg>`
                        ),
                        left: 400,
                        top: 200
                    }
                ]).toFormat('png').toBuffer();

                const channel = client.channels.cache.get(ct.channelId);

                //@ts-ignore
                channel.send({
                    content: `## <@!${ct.author.id}> :heart: ${randomPercent}% :heart: <@!${user2nd.id}>\n*${randomPercent === 100
                        ? "ĐITME YÊU VÃI LỒN LUÔN ĐÓ, CHÚNG TA LÀ CỦA NHAU"
                        : randomPercent >= 90
                            ? "Em biết tại sao một tuần lại bắt đầu từ thứ hai không😳 tại vì em luôn là thứ nhất🥰"
                            : randomPercent >= 80
                                ? "Dạo này anh thấy nụ cười em rất giống cây xăng nhá, tại vì sao!?!? TẠI VÌ RẤT NHIỀU NGƯỜI ĐỔ"
                                : randomPercent >= 70
                                    ? "Trên trái đất có 8 tỉ người nhưng chỉ có 1 người làm anh say đắm"
                                    : randomPercent >= 60
                                        ? "Vì anh viết văn điểm kém, làm thơ điểm 0 nên yêu em không thể tả:)"
                                        : randomPercent >= 50
                                            ? "Vẻ đẹp không nằm ở đôi má hồng của người thiếu nữ mà trong đôi mắt của kẻ suy tình"
                                            : randomPercent >= 40
                                                ? "Bầu trời hôm nay không có nắng, trong lòng trống vắng vì thiếu anh"
                                                : randomPercent >= 30
                                                    ? "Nắng đã có mưa, trời đã có đất nhưng anh vẫn chưa có em"
                                                    : randomPercent >= 20
                                                        ? "Tình yêu như bác bún riêu, yêu thì ít nói điêu thì nhìu"
                                                        : randomPercent >= 15
                                                            ? "Yêu nhau mấy núi cũng trèo mấy sông cũng lội thấy nghèo bỏ luôn"
                                                            : randomPercent >= 10
                                                                ? "Anh yêu em tỉ lệ thuận với ví tiền anh, chẳng có tí nào"
                                                                : randomPercent >= 1
                                                                    ? "Rõ là không duyên phận mà cứ cố chấp đâm đầu, thật ngu dốt, thật stupid"
                                                                    : "Em ăn cơm chưa"}*`,
                    files: [output]
                });

            } catch (e) {
                ct.reply("***Lỗi:** Không thể thực thi câu lệnh vì lỗi không xác định!*");
                log({
                    type: 3,
                    message: "Cannot load love command: " + e
                });
            }


        }

    }
}

export default evt;