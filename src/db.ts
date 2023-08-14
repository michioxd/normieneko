import { Sequelize, DataTypes } from "sequelize";
import { UserType } from "./types";
import log from "./utils/logger.js";

const db = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});


const User = db.define("user", {
    uid: DataTypes.STRING,
    birthdayDay: DataTypes.INTEGER,
    birthdayMonth: DataTypes.INTEGER,
    birthdayYear: DataTypes.INTEGER,
});

try {
    await User.sync();
} catch (e) {
    log({
        type: 3,
        message: `Cannot sync db: ${e}`
    })
}

export default db;

export { User };