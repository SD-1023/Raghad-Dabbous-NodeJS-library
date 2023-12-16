import express from "express";
import booksRoutes from './routes/booksRoutes'

// const express = require("express");
// const booksRoutes = require("./routes/booksRoutes")

const app = express();

app.use(express.json())

app.set("view engine", "pug");
app.set("views", "./views");

app.use('/books' , booksRoutes);


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})