import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { GiveawayJoinedType, GiveawayType, PlaylistType, SpotifyAccessTokenType, UserType } from "./types";
import log from "./utils/logger.js";



const db = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    logging: false
});


const User = db.define<UserType>("user", {
    uid: DataTypes.STRING,
    birthdayDay: DataTypes.INTEGER,
    birthdayMonth: DataTypes.INTEGER,
    birthdayYear: DataTypes.INTEGER,
});

const Giveaway = db.define<GiveawayType>("giveaway", {
    uuid: DataTypes.STRING,
    createdBy: DataTypes.STRING,
    expired: DataTypes.INTEGER,
    maxUser: DataTypes.INTEGER,
    done: DataTypes.INTEGER
});

const GiveawayJoined = db.define<GiveawayJoinedType>("giveaway_joined", {
    uid: DataTypes.STRING,
    joinedAt: DataTypes.INTEGER,
    gaUuid: DataTypes.STRING,
    uuid: DataTypes.STRING
});

const Playlist = db.define<PlaylistType>("playlist", {
    uid: DataTypes.STRING,
    addedAt: DataTypes.NUMBER,
    addedBy: DataTypes.STRING,
    url: DataTypes.STRING,
    played: DataTypes.NUMBER,
    title: DataTypes.STRING,
    originalUrl: DataTypes.STRING,
    streamingType: DataTypes.NUMBER,
    fromTitle: DataTypes.NUMBER
});

const SpotifyAccessToken = db.define<SpotifyAccessTokenType>("SpotifyAccessToken", {
    token: DataTypes.STRING,
    lastUpdated: DataTypes.NUMBER
});

try {
    await User.sync();
    await Giveaway.sync();
    await GiveawayJoined.sync();
    await Playlist.sync();
    await SpotifyAccessToken.sync();
} catch (e) {
    log({
        type: 3,
        message: `Cannot sync db: ${e}`
    })
}

export default db;

export { User, Giveaway, GiveawayJoined, Playlist, SpotifyAccessToken };