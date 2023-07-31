/* michioxd confidential software - copyright 2023 */

import dotenv from 'dotenv';
import { ActivityType, Client, Collection, Events, GatewayIntentBits } from 'discord.js';
import { CustomClient } from './types';
import cmds from './command.js';

import './events/welcome.js';
import eventLists from './event.js';

dotenv.config();

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once(Events.ClientReady, c => {
    console.log(`[BOT] Logged in as ${c.user.tag}`);
});

client.once(Events.ClientReady, async c => {
    const guild = client.guilds.cache.get(process.env.GUILD_ID);

    let lastSize = 0;
    const fetchMemCount = async () => {
        const memberCount = await guild.members.fetch();
        const fullMember = memberCount.filter(member => !member.user.bot).size;
        if (fullMember !== lastSize) {
            lastSize = fullMember;
            client.user.setPresence({
                status: "online",
                activities: [
                    {
                        name: `${fullMember} thành viên`,
                        type: ActivityType.Watching,
                        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                    }
                ]
            });
        }
        setTimeout(fetchMemCount, 5000);
    }

    fetchMemCount();
});

client.login(process.env.TOKEN);

const botHandle = client as CustomClient;


// Handle Commands
botHandle.commands = new Collection();

for (const cmd of cmds) {
    if ('data' in cmd && 'execute' in cmd) {
        botHandle.commands.set(cmd.data.name, cmd);
    } else {
        console.log(`[WARNING] The command is missing a required "data" or "execute" property.`);
    }
}


botHandle.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = (interaction.client as CustomClient).commands.get(interaction.commandName);

    if (!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
        } else {
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    }
});

// Handle Events

for (const evt of eventLists) {
    if (evt.once) {
        //@ts-ignore
        client.once(evt.name, (...args) => evt.execute(...args));
    } else {
        //@ts-ignore
        client.on(evt.name, (...args) => evt.execute(...args));
    }
}


export default botHandle;