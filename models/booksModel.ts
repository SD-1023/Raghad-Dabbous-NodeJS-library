import sequelize from "../database/db";
import { DataTypes } from "sequelize";

const booksModel = sequelize.define("books" , {
    bookID:{
        type : DataTypes.INTEGER,
        autoIncrement : true,
        primaryKey : true
    },
    title: {
        type: DataTypes.STRING,
        allowNull : false
    },
    isbn : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    pages : {
        type :DataTypes.INTEGER,
        allowNull : true,
    },
    year : {
        type : DataTypes.INTEGER,
        allowNull : true
    },
    author : {
        type :DataTypes.STRING,
        allowNull : true
    },
    publisherID : {
        type: DataTypes.INTEGER,
        allowNull : false,
    },
},{
    timestamps: false
})

export default booksModel