import { EventType } from "./types";

import welcome from './events/welcome.js';
import notifyHandler from './events/notifyHandler.js';
import simbot from './events/simbot.js';

const eventLists: EventType[] = [
    welcome,
    notifyHandler,
    simbot
];

export default eventLists