// const express = require("express");
// const bookServices = require("../services/bookServices");
import express from "express"
import bookServices from "../services/bookService.js";
import booksModel from "../models/booksModel.js";
import publisherModel from "../models/publisherModel.js";
import commentsModel from "../models/commentsModel.js";
import sequelize from "../database/db.js";
import Sequelize  from "sequelize";

const router = express.Router();

publisherModel.hasMany(booksModel , {foreignKey : "publisherID"  });
booksModel.belongsTo(publisherModel , {foreignKey : "publisherID"});

booksModel.hasMany(commentsModel ,  {foreignKey : "book_id"});
commentsModel.belongsTo(booksModel ,  {foreignKey : "book_id" });

/*
 required fields: title, isbn, publisher_id
    optional fields: year, author, pages

*/
interface IBook{
    isbn : number,
    title : string,
    publisher_id : number,
    author? : string,
    year? : number,
    pages? : number
}

router.get("/", async (req, res)=>{
    try{
        const result = await booksModel.findAll();
        if(result.length == 0){
            res.json("The library is empty");
            return;
        }
        res.json(result);
    }catch(error){
        res.status(500).send("server error");
    } 
    
    // try{
    //     const Books =await bookServices.getBooks();
    //     // res.render("homepage", {Books}) 
    //     if(Books.length > 0){
    //         res.json(Books); 
    //      }else{
    //         res.status(404).send("the library is empty")
    //      } 
    // }catch(error){
    //     res.status(500).send("server error");
    // } 
})

router.get("/search" ,async (req , res) => {
    if(!req.query.name){
        res.status(400).json("name is required");
        return;
    }
    try{
        const name = req.query.name;
        const books = await booksModel.findAll({
            where :{
                title: {
                    [Sequelize.Op.like]: `%${name}%`,
                },
            }
        })
        res.json(books);
        // const name = req.query.name.toString().toLowerCase();
        // const result = await bookServices.searchByName(name);
        // // res.status(200).render("homepage" , {result});
        // res.json(result);
    }catch(error){
        console.log(error.message);
        res.status(500).send("server error");
    }
})
//SELECT books.*, AVG(comments.stars)
// FROM books
// INNER JOIN comments on books.bookID = comments.book_id
// GROUP BY books.title
// ORDER BY AVG(comments.stars) DESC
// LIMIT 10;
router.get('/top-rated' , async(req, res)=>{
    try{
        const result = await booksModel.findAll({
        attributes: [
            'title', 
            [sequelize.fn('AVG', sequelize.col("comments.stars")), 'averageStars'],
          ],
        include: [{
            model:commentsModel,
            attributes :[],
            as: 'comments',
        }],
        group: ['title'], 
        order: [[sequelize.fn('AVG', sequelize.col('comments.stars')), 'DESC']],
        limit: 10,
        subQuery: false
      });
      res.json(result);

    }catch(error){
        console.log(error.message);
        res.status(500).send("server error");
    }
    
})

router.get('/:id' , async(req , res)=>{
    try{
        const id = parseInt(req.params.id);
        const book = await booksModel.findByPk(id,
            {
                include : [publisherModel , commentsModel ]
            }
        );
        if(!book){
            res.status(404).json("No book has been found");
            return
        }
        res.json(book);

    }catch(error){
        res.status(500).send("server error");
    }
    
})

router.post("/" , async (req, res)=>{
    if(!req.body.isbn || req.body.isbn.toString().replace(/-/g, '').length <10 || req.body.isbn.toString().replace(/-/g, '').length >13){
        res.status(400).json("invalid isbn");
        return;
    }
    if(!req.body.title || typeof(req.body.title) != 'string'){
        res.status(400).json("invalid title");
        return;
    }
    if(!req.body.publisherID || typeof(req.body.publisherID) != 'number'){
        res.status(400).json("invalid publisher id");
        return;
    }
    try{
        const publisher_ID = parseInt(req.body.publisherID);
        const publisher = await publisherModel.findByPk(publisher_ID);

        if(!publisher){
            res.status(400).json("Publisher not found");
            return;
        }

        const isbn = parseInt(req.body.isbn);
        const book = await booksModel.findOne({
            where : {
                isbn : isbn
            }
        });
        console.log(book);
        if(book){
            res.status(400).json("isbn should be unique");
            return;
        }
        
        const result = await booksModel.create(req.body);
        res.status(201).json(result);

        // const allBooks = await bookServices.createNewBook(req.body);
        // // res.status(201).render("homepage" , {Books});
        // res.status(201).json(allBooks);
    }catch(error){
        console.log(error)
        res.status(500).send("server error");
    } 
})

router.put("/:id" , async(req,res)=>{
    try{
        const id: number =parseInt( req.params.id);
        const result = await booksModel.update(req.body,{
            where :{
                bookID : id
            }
        });
        if(result){
           res.json("Updated succesfully"); 
        }//return some response
    }catch(error){
        res.status(500).send("server error")
    }
    
})

router.delete("/:id" , async(req , res) =>{
    try{
        const id: number =parseInt( req.params.id);
        const book = await booksModel.findByPk(id ,{
            include :[commentsModel]
        });
        if(!book){
           res.status(404).json("No book has been found.");
           return; 
        }
        await book.destroy();
        res.json("deleted successfully");

    }catch(error){
        res.status(500).send("server error")
    }
})


// module.exports = router;
export default router