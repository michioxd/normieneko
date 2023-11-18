import { EventType } from "./types";

import welcome from './events/welcome.js';
import notifyHandler from './events/notifyHandler.js';
import simbot from './events/simbot.js';
import emotion from './commands/dot/emotion.js';
import help from './commands/dot/help.js';
import love from './commands/dot/love.js';
import taixiu from './commands/dot/taixiu.js';
import farewell from './commands/dot/farewell.js';
import musicPlayer_play from './commands/dot/music/command.js';

const eventLists: EventType[] = [
    welcome,
    notifyHandler,
    simbot,
    emotion,
    help,
    love,
    taixiu,
    musicPlayer_play
];

export default eventLists;