import { EventType } from "./types";

import welcome from './events/welcome.js';
import notifyHandler from './events/notifyHandler.js';
import simbot from './events/simbot.js';
import emotion from './commands/dot/emotion.js';
import help from './commands/dot/help.js';
import love from './commands/dot/love.js';

const eventLists: EventType[] = [
    welcome,
    notifyHandler,
    simbot,
    emotion,
    help,
    love
];

export default eventLists