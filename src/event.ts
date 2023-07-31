import { EventType } from "./types";

import welcome from './events/welcome.js';
import notifyHandler from './events/notifyHandler.js';

const eventLists: EventType[] = [
    welcome,
    notifyHandler
];

export default eventLists