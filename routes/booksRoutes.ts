import express from "express";
import booksSrvice ,{Ibook} from "../services/index"

// const express = require("express");
// const {readFile} = require('fs/promises');
// const fs = require('fs');
// const books = require("../services/index");



const router = express.Router();

// let books = [];

// interface IBooks {
//     isbn : number,
//     name : string,
//     author : string
// }

// router.use(async (req , res , next) =>{
//     try{
//         fs.stat("books.json", async function(err, stat) {
//             if(err == null){ //file exist
//                 const data = await readFile("books.json", "utf8");
//                 let books = JSON.parse(data);
//                 req.books = books; // send books array in req
//                 next();
//                 // const data =await readFile(, (err, data) => {
//                 //     if (err) throw err;
//                 //     let books: IBooks[]  = JSON.parse(data);
//                 //     req.books = books; // send books array in req
//                 //     next();
//                 // });
                
//             }
//             else if (err.code === 'ENOENT') { //file does not exist
//                 res.status(404).send("file not found")
//             }
//         });    
        
//     }catch(error){ //send error message
//         res.status(500).send("server error")
//     }
// })


router.get('/search' , async (req , res)=>{ 
    try{ 
        if(!req.query.name){
            res.status(400).send("name is required");
            return;
        }
        const name:string = req.query.name.toLocaleLowerCase();

        const result = await booksSrvice.search(name)
        res.json(result);
    }catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/' ,async (req , res)=>{
    // const books= req.books;
    let allBooks : Ibook[] =[];
    try{
        allBooks = await booksSrvice.getBooks();
        res.render("homepage", {allBooks})  
    }catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/:isbn' , async (req , res)=>{
    const isbn:number = parseInt( req.params.isbn);
    // const books = req.books
    try{      
        const book = await booksSrvice.getBookByISBN(isbn);
        res.status(200).render("bookDetails" , {book})

    }catch (error) {
        res.status(500).send(error.message);
    }
})


router.post('/' ,async (req , res)=>{
    if(!req.body.isbn || typeof(req.body.isbn) != 'number' || req.body.isbn.toString().length <10 || req.body.isbn.toString().length >13){
        res.status(400).json("invalid isbn");
    }
    else if(!req.body.name || typeof(req.body.name) != 'string' ){
        res.status(400).json("invalid name");
    }else{ 
        try{
            let allBooks = await booksSrvice.newBook(req.body)
            res.status(201).json(allBooks);
        }catch (error) {
            res.status(500).send(error.message);
        }
    }  
})


export default router
// module.exports = router

