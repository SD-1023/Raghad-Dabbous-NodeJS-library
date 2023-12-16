// const fs = require('fs');
// const {readFile} = require('fs/promises');
import * as fs from "fs/promises";
import {readFile} from 'fs/promises';

export interface Ibook{
    isbn : number,
    name : string,
    author : string,
}

async function getBooks() : Promise<Ibook[]>{
    let books : Ibook[] =[];
    try{
        const data = await readFile("./books.json", "utf8");
        books = JSON.parse(data);
        console.log(books)
        return books;
    }catch(error){ //send error message
        console.log(error)
    }
      
}

async function getBookByISBN(isbn: number) : Promise<Ibook>{
    try{
        let books  =await getBooks();
        const book: Ibook = books.find(b => b.isbn == isbn);
        // console.log(book)
        return book;
    }catch(error){ //send error message
        console.log(error)
    }
    
}

async function newBook(book: Ibook): Promise<Ibook[]> {
    try{
        let books:Ibook[] = await getBooks();
        const newBbook: Ibook = {
            isbn : book.isbn,
            name : book.name,
            author: book.author 
        }
        books.push(newBbook);
        await fs.writeFile("./books.json", JSON.stringify(books));
        return books;
    }catch (error) {
        console.log(error)
    }
}

async function search(name: string): Promise<Ibook[]>{
    try{
        let books:Ibook[] = await getBooks();
        const result: Ibook[] = books.filter((book)=>{
            return book.name.toLocaleLowerCase().includes(name);
        });
        return result;
    }catch (error) {
        console.log(error)
    }
}

// module.exports = {getBooks , newBook , search , getBookByISBN}
export default {getBooks , newBook , search , getBookByISBN };