const express = require("express");
const {readFile} = require('fs/promises');
const fs = require('fs');

const router = express.Router();

// let books = [];

router.use(async (req , res , next) =>{
    try{
        fs.stat("books.json", async function(err, stat) {
            if(err == null){ //file exist
                const data =await readFile("books.json" , "utf-8");
                books= JSON.parse( data);
                req.books = books; // send books array in req
                next();
            }
            else if (err.code === 'ENOENT') { //file does not exist
                res.status(404).send("file not found")
            }
        });    
        
    }catch(error){ //send error message
        res.status(500).send("server error")
    }
})

router.get('/' ,async (req , res)=>{
    const books = req.books;
    try{
        res.render("homepage", {books})  
    }catch (error) {
        res.status(500).send(error.message);
    }
})

router.get('/:id' , async (req , res)=>{
    const id = parseInt( req.params.id);
    const books = req.books
    try{      
        const book = books.find(b => b.id === id);
        res.status(200).render("bookDetails" , {book})

    }catch (error) {
        res.status(500).send(error.message);
    }
})

router.post('/' ,async (req , res)=>{
    const books = req.books
    if(!req.body.name || typeof(req.body.name) != 'string' ){
        res.status(400).json("invalid name");

    }else{
        try{
            const newBbook = {
                id : books.length + 1,
                name : req.body.name
            }
            books.push(newBbook);
            fs.writeFileSync("books.json", JSON.stringify(books));
            res.status(201).json(books);
        }catch (error) {
            res.status(500).send(error.message);
        }
    }  
})


module.exports = router;