import { CommandType } from './types.js';

import demo from './commands/demo.js';
import bonk from './commands/bonk.js';

import admin_createNotify from './commands/admin_createNotify.js';


const cmds: CommandType[] = [
    demo,
    //@ts-ignore
    bonk,
    admin_createNotify
];

export default cmds;