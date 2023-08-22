import sharp from 'sharp';
import axios from 'axios'

// Đường dẫn đến hai tấm ảnh ban đầu
const image1Path = (await axios({ url: 'https://cdn.discordapp.com/avatars/536175851247501347/25f49157f2842d0f0496a9d5116746e8.webp', responseType: "arraybuffer" })).data;
const image2Path = (await axios({ url: 'https://cdn.discordapp.com/avatars/536175851247501347/25f49157f2842d0f0496a9d5116746e8.webp', responseType: "arraybuffer" })).data;

// Đường dẫn đến ảnh gộp sau khi xử lý
const outputPath = 'output_image.png';


try {
    const image1 = await sharp(image1Path).resize(200, 200).toBuffer();
    const image2 = await sharp(image2Path).resize(200, 200).toBuffer();

    const heart = await sharp("./assets/heart.png")
        .composite([
            {
                input: Buffer.from(
                    `<svg width="200" height="200"><text x="50%" y="55%" font-size="45" fill="#fff" font-weight="bold" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">50%</text></svg>`
                )
            }
        ])
        .toBuffer();


    await sharp({
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
                `<svg width="200" height="50"><text x="50%" y="50%" font-size="12" fill="#57FF70" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">firstUserName</text></svg>`
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
                `<svg width="200" height="50"><text x="50%" y="50%" font-size="12" fill="#57FF70" font-family="Google Sans" dominant-baseline="middle" text-anchor="middle">secondUserName</text></svg>`
            ),
            left: 400,
            top: 200
        }
    ]).toFile(outputPath);

    console.log("OK");


} catch (e) {
    console.log(e);
}

// sharp(image1Path)
//     .resize(128, 128)
//     .toBuffer()
//     .then(buffer1 => {
//         return sharp(image2Path)
//             .resize(300, 300)
//             .toBuffer()
//             .then(buffer2 => {
//                 return sharp({
//                     create: {
//                         width: width,
//                         height: height,
//                         channels: 3,
//                         background: { r: 255, g: 255, b: 255, alpha: 1 }
//                     }
//                 })
//                     .composite([
//                         { input: buffer1, left: 0, top: 0 },
//                         { input: buffer2, left: 0, top: 0 }
//                     ])
//                     .toFile(outputPath)
//                     .then(() => {
//                         console.log('Ảnh đã được gộp thành công!');
//                     })
//                     .catch(err => {
//                         console.error('Lỗi khi gộp ảnh:', err);
//                     });
//             });
//     });



/*

sharp(imagePath)
    .resize(imageWidth, imageHeight)
    .toBuffer()
    .then(imageBuffer => {
        return sharp(imageBuffer)
            .overlayWith(
                Buffer.from(
                    `<svg width="${imageWidth}" height="${imageHeight}"><text x="${textX}" y="${textY}" font-size="${fontSize}" fill="${textColor}" font-family="sans-serif" dominant-baseline="middle" text-anchor="middle">${text}</text></svg>`
                ),
                { inputFormat: 'svg' }
            )
            .toFile(outputPath)
            .then(() => {
                console.log('Đã chèn chữ vào ảnh thành công!');
            })
            .catch(err => {
                console.error('Lỗi khi chèn chữ vào ảnh:', err);
            });
    });

    */