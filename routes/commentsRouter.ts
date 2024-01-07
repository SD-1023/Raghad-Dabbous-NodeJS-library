import expreess from "express"
import commentsModel from "../models/commentsModel";
import booksModel from "../models/booksModel";
import sessionsModel from "../models/sessionsModel";


const router =expreess();

router.delete('/:id' , async(req ,res)=>{
    try{
        const id = parseInt(req.params.id);
        const comment = await commentsModel.findByPk(id);

        if(!comment){
            res.status(404).send("No comment has been found.");
            return;
        }

        await comment.destroy();
        res.send("Deleted successfully");

    }catch(error){
        res.status(500).send("server error");
    }
})

router.post('/', async (req, res)=>{
    try{
        if(!req.body.name || typeof(req.body.name) != 'string'){
            res.status(400).json("invalid name");
            return;
        }
        if(!req.body.comment || typeof(req.body.comment) != 'string'){
            res.status(400).json("invalid comment");
            return;
        }
        if(!req.body.book_id || typeof(req.body.book_id) != 'number'){
            res.status(400).json("invalid book id");
            return;
        }

        const bookID = parseInt(req.body.book_id);
        const book = await booksModel.findByPk(bookID);
        if(!book){
            res.status(400).json("book id should an id of existing book");
            return;
        }
        //get user id from req
        const session = req.headers.authorization;
        const data = await sessionsModel.findOne({
            where : {
                session : session
            }
        })

        const userID = data.dataValues.userID;

        const newComment = {
            name : req.body.name,
            comment : req.body.comment,
            stars : req.body.stars,
            book_id : req.body.book_id,
            userID : userID
        }
        const result = await commentsModel.create(newComment);
        res.status(201).json(result);

    }catch(error){
        console.log(error)
        res.status(500).send("server error");
    }
})


export default router;