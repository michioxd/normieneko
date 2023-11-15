import { Sequelize, DataTypes, Model, InferAttributes, InferCreationAttributes } from "sequelize";
import { GiveawayJoinedType, GiveawayType, UserType } from "./types";
import log from "./utils/logger.js";



const db = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
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

try {
    await User.sync();
    await Giveaway.sync();
    await GiveawayJoined.sync();
} catch (e) {
    log({
        type: 3,
        message: `Cannot sync db: ${e}`
    })
}

export default db;

export { User, Giveaway, GiveawayJoined };