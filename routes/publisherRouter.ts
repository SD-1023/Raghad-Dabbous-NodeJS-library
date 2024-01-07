import express from "express";
import publisherModel from "../models/publisherModel";
import booksModel from "../models/booksModel";

const router = express.Router();


router.get('/' , async (req , res)=>{
    try{
        const result = await publisherModel.findAll();
        res.json(result);
    }catch(error){
        res.status(500).json("server error")
    }
    
})

router.get('/:id' , async(req , res)=>{
    try{
        const id = parseInt(req.params.id)
        const result = await publisherModel.findByPk(id);
        if(!result){
            res.status(404).json("No publisher has been found");
            return;
        }
        res.json(result);
    }catch(error){
        res.status(500).json({message : "server error"});
    }
    
})

//Get books by a publisher
router.get('/:id/books' , async(req , res)=>{
    try{
        const id = parseInt(req.params.id)
        const publisher = await publisherModel.findByPk(id,{
            include : [booksModel]
        })

        if(!publisher){
            res.status(404).json("No publisher has been found");
            return;
        }
        if(publisher.dataValues.books.length == 0){
            res.json("This publisher does not have any books");
            return;
        }
        const books = publisher.dataValues.books;
        res.json(books);

    }catch(error){
        res.status(500).json("server error")
    }
})

router.delete('/:id' , async(req ,res)=>{
    try{
        const id = parseInt(req.params.id);
        const publisher = await publisherModel.findByPk(id ,{
            include : [booksModel]
        });
        
        if(!publisher){
            res.status(404).json("No publisher has been found");
            return;
        }
        console.log(publisher);
        if(publisher.dataValues.books.length > 0){ //if it has any published books
            res.status(400).json("The publisher cannot be deleted because it has published books ");
            return;
        }

        await publisher.destroy();
        res.send("Deleted successfully");

    }catch(error){
        console.log(error)
        res.status(500).json("server error")
    }
})

router.post('/', async (req, res)=>{
    try{
        if(!req.body.name || typeof( req.body.name) != 'string'){
            res.status(400).json("invalid name");
            return;
        }
        const result = await publisherModel.create(req.body);
        res.status(201).json(result);

    }catch(error){
        console.log(error)
        res.status(500).send("server error");
    }
})

export default router