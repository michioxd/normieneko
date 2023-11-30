import { EventType } from "./types";

import welcome from './events/welcome.js';
import notifyHandler from './events/notifyHandler.js';
import simbot from './events/simbot.js';
import emotion from './commands/dot/emotion.js';
import help from './commands/dot/help.js';
import love from './commands/dot/love.js';
import taixiu from './commands/dot/taixiu.js';
import musicPlayer_command from './commands/dot/music/command.js';
import musicPlayer_listening from './commands/dot/music/listening.js';
import say from "./commands/dot/say.js";

const eventLists: EventType[] = [
    welcome,
    notifyHandler,
    simbot,
    emotion,
    help,
    love,
    taixiu,
    musicPlayer_command,
    say,

    //@ts-ignore
    musicPlayer_listening
];

export default eventLists;