import sequelize from "../database/db";
import { DataTypes } from "sequelize";

const commentsModel = sequelize.define("comments",{
    commentID :{
        type : DataTypes.INTEGER,
        primaryKey : true,
        autoIncrement : true
    },
    name:{
        type: DataTypes.STRING,
        allowNull : false
    },
    comment : {
        type: DataTypes.STRING,
        allowNull : false
    },
    stars : {
        type : DataTypes.INTEGER,
        allowNull : true,
    },
    book_id : DataTypes.INTEGER,
    userID : DataTypes.INTEGER
},{
    tableName: 'comments',
    timestamps: false
}) 

export default commentsModel