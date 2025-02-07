/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const Book = require('../models').Book;

module.exports = function (app) {

  app.route('/api/books')
    .get(async(req, res) => {
      try{
        const books = await Book.find({});
        if(!books) {
          res.json([]);
          return;
        }
        const dataFormat = books.map((book) => {
          return{
            _id: book._id,
            title: book.title,
            comments: book.comments,
            commentcount: book.comments.length,
          };
        });
        res.json(dataFormat);
        return;
      } catch(err) {
        res.json([]);
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async (req, res) => {
      let title = req.body.title;
      if(!title) {
        res.send("missing required field title");
        return
      }
      const newBook = new Book({ title, comment: []});
      try{
        const book = await newBook.save();
        res.json({_id: book._id, title: book.title});
      } catch(err) {
        res.send("there is an error")
      }
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async(req, res) => {
      try{
        const deleteBooks = await Book.deleteMany();
        console.log("deleted books: ", deleteBooks);
        res.send("complete delete successful");
      } catch(err) {
        res.send("error")
      }
      //if successful response will be 'complete delete successful'
    });



  app.route('/api/books/:id')
    .get(async (req, res) => {
      let bookID = req.params.id;
      try{
        const book = await Book.findById(bookID);
        res.json({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
          comments: book.comments,
        });
      } catch(err) {
        res.send("no book exists");
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async(req, res)=> {
      let bookID = req.params.id;
      let comment = req.body.comment;
      if(!comment) {
        res.send(`missing required field comment`);
        return;
      }
      try{
        let book = await Book.findById(bookID);
        book.comments.push(comment);
        book = await book.save();
        res.json({
          comments: book.comments,
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length,
        })
      } catch (err) {
        res.send("no book exists")
      }
    })
    
    .delete(async(req, res)=> {
      let bookID = req.params.id;
      try{
        const deleteBooks = await Book.findByIdAndDelete(bookID);
        console.log("deleted books: ", deleteBooks);
        if(!deleteBooks) throw new Error("no books exist");
        res.send("delete successful");
      } catch(err) {
        res.send("no book exists");
      }
      //if successful response will be 'delete successful'
    });
  
};
