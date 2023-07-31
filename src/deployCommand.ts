import { REST, Routes } from "discord.js";
import cmds from "./command.js";
import dotenv from 'dotenv';

dotenv.config();

const commands = [];

console.log("[DEPLOY_COMMAND] Starting...");

for (const cmd of cmds) {
    if ('data' in cmd && 'execute' in cmd) {
        console.log('loadded');
        commands.push(cmd.data.toJSON());
    } else {
        console.log(`[WARNING] The command is missing a required "data" or "execute" property.`);
    }
}

const rest = new REST().setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${cmds.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.APP_ID, process.env.GUILD_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();