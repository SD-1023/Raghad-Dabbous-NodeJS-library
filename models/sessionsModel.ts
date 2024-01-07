import sequelize from "../database/db";
import { DataTypes } from "sequelize";

const sessionsModel = sequelize.define("sessions",{
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement :true
    },
    userID : DataTypes.INTEGER,
    session : DataTypes.STRING
},{
    timestamps: false,
})

export default sessionsModel