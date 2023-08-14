import { Awaitable, Client, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface CustomClient extends Client {
    commands: any
}

export interface CommandType {
    data: SlashCommandBuilder,
    execute(interaction: any): Promise<void>
}

export interface EventType {
    name: any,
    once: boolean,
    execute(interaction: any): Promise<void>
}

export interface UserType {
    uid: string,
    birthdayDay: number,
    birthdayYear: number,
    birthdayMonth: number
}