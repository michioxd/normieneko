import { CommandType } from './types.js';

import demo from './commands/demo.js';
import bonk from './commands/bonk.js';
import birthday from './commands/birthday.js';

import admin_createNotify from './commands/admin_createNotify.js';
import admin_message from './commands/admin_message.js';
import admin_giveaway from './commands/admin_giveaway.js';


const cmds: CommandType[] = [
    demo,
    //@ts-ignore
    bonk,
    //@ts-ignore
    birthday,


    admin_giveaway,
    admin_createNotify,
    admin_message
];

export default cmds;