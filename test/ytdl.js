import ytdl from "ytdl-core";
import { writeFile } from 'fs/promises';

try {
    const res = await ytdl.getBasicInfo("https://www.youtube.com/watch?v=VzzvtfS4_aE");
    await writeFile("./output.json", JSON.stringify(res), 'utf8');
} catch (e) {
    console.error(e);
}