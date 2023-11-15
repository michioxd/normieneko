import { Awaitable, Client, ColorResolvable, CommandInteraction, HexColorString, SlashCommandBuilder } from "discord.js";
import { InferAttributes, InferCreationAttributes, Model } from "sequelize";

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

export interface UserType extends Model<InferAttributes<UserType>, InferCreationAttributes<UserType>> {
    uid: string,
    birthdayDay: number,
    birthdayYear: number,
    birthdayMonth: number
}

export interface GiveawayType extends Model<InferAttributes<GiveawayType>, InferCreationAttributes<GiveawayType>> {
    uuid: string,
    createdBy: string,
    expired: number,
    maxUser: number,
    done: number
}

export interface GiveawayJoinedType extends Model<InferAttributes<GiveawayJoinedType>, InferCreationAttributes<GiveawayJoinedType>> {
    uid: string,
    joinedAt: number,
    gaUuid: string,
    uuid: string
}

export type EmotionType = {
    name: string,
    text: string,
    image: string[],
    color: ColorResolvable
}