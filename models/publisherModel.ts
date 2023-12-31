import sequelize from "../database/db";
import { DataTypes } from "sequelize";

const publisherModel = sequelize.define("publisher" ,{
    publisherID :{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement :true
    },
    name : {
        type: DataTypes.STRING,
        allowNull : false
    },
    country :{
        type : DataTypes.STRING,
        allowNull : true
    }
},{
    tableName : "publisher",
    timestamps: false
})

export default publisherModel