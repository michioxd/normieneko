import { readFile } from 'node:fs/promises';
import log from './logger.js';

const initialValue = {
    welcomeText: `Chào mừng bạn {{USER_TAG}} đã đến với sivi ||${Math.round(Math.random()) > 0 ? "trẩu" : "rách"}|| này\nđám {{HELPER_ROLE}} dậy gáy coi`,
    enableWelcome: true
};

const getConfig = async () => {
    try {
        const cfg = await readFile("./config.json", { encoding: 'utf8' });

        if (cfg) {
            return JSON.parse(cfg);
        } else {
            return false;
        }
    } catch (e) {
        log({ type: 3, message: "Cannot get configuration file: " + e });
        return false;
    }
}