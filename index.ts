// const express= require("express");
// const bookRouter =require("./routes/booksRouter")
import express from "express";
import bookRouter from "./routes/booksRouter.js"
import publisherRouter from "./routes/publisherRouter.js";
import commentsRouter from "./routes/commentsRouter.js"
import authRouter from "./routes/authRouter.js"
import authorizationRouter from "./routes/authorization.js" 
import sequelize from "./database/db.js";

const app = express();

app.use(express.json());

app.set("view engine", "pug");
app.set("views", "./views");

// sequelize.sync({alter : true})

app.use("/auth" , authRouter); //authentecation
app.use("/" ,authorizationRouter )
app.use("/books" ,bookRouter );
app.use("/publisher" ,publisherRouter );
app.use("/comments" , commentsRouter);

app.listen("3000" ,()=>{
    console.log("server run on port 3000");
})