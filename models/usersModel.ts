import sequelize from "../database/db";
import { DataTypes} from "sequelize";

const usersModel = sequelize.define("users" , {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    email : {
        type : DataTypes.STRING,
        unique : true
    },
    salt : DataTypes.STRING,
    password : DataTypes.STRING
},{
    tableName :"users",
    timestamps : false
})

export default usersModel