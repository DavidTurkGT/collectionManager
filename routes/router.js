const express   = require('express');
const router    = express.Router();
const mongoose  = require('mongoose');
mongoose.connect('mongodb://localhost:27017/library');
const Schema = mongoose.Schema;

let authorsList = [];
let booksList = [];
let bookAuthor = {};
////////////////////////////////////////////////////////////////////////////////
//Support Functions
function validateAuthor(req){
  req.checkBody('firstname', "Please enter a first name for the author").notEmpty();
  req.checkBody('lastname', 'Please enter a last name for the author').notEmpty();

  return req.validationErrors();
};

function buildAuthor(data){
  let newAuthor = {
    name: {
      firstname: data.firstname,
      lastname: data.lastname
    }
  }
  if(data.street){
    newAuthor.address = {};
    newAuthor.adreess.street = data.street;
  }
  if(data.city){
    newAuthor.address = newAuthor.address || {};
    newAuthor.address.city = data.city;
  }
  if(data.state){
    newAuthor.address = newAuthor.address || {};
    newAuthor.address.state = data.state;
  }
  if(data.zip){
    newAuthor.address = newAuthor.address || {};
    newAuthor.address.zip = data.zip;
  }
  return newAuthor
};

function validateBook(req){
  req.checkBody('title','Please enter a book title').notEmpty();
  req.checkBody('length','Please provide the length of the book').notEmpty();
  req.checkBody('haveRead','Please indicate whether you have read the book').notEmpty();

  return req.validationErrors();
};

function buildBook(data, bookAuthor){
  let newBook = {
    title: data.title,
    length: Number(data.length),
    haveRead: data.haveRead ? true : false,
    author: bookAuthor
  }
  if(data.isbn){
    newBook.isbnNumber = Number(data.isbn)
  }
  return newBook;
};

function renderErrors(errors, res){
  let errorMessages = [];
  errors.forEach( (err) => errorMessages.push(err.msg) );
  res.render("index", {errors: errorMessages});
}

////////////////////////////////////////////////////////////////////////////////
//Models
const authorSchema = new Schema({
  name: {
    firstname: {type: String, required: true},
    lastname: {type: String, required: true}
  },
  address: {
    street: String,
    city: String,
    state: String,
    zip: Number
  }
});

authorSchema.virtual('fullName').get( function() {
  return this.name.firstname + " " + this.name.lastname;
});

const Author = mongoose.model("Author", authorSchema);

const bookSchema = new Schema({
  title: { type: String, required: true, trim: true},
  isbnNumber: { type: Number, unique: true},
  length: { type: Number, required: true},
  chapters: [{
    type: String,
    title: {type: String, trim: true},
    length: Number
  }],
  haveRead: { type: Boolean, required: true},
  author: {
    name: {
      fullname: String,
      firstname: {type: String, required: true},
      lastname: {type: String, required: true}
    },
    address: {
      street: String,
      city: String,
      state: String,
      zip: Number
    }
  }
});

const Book = mongoose.model("Book", bookSchema);
////////////////////////////////////////////////////////////////////////////////
//Middleware
function getAuthors (req, res, next){
  console.log("Finding authors");
  Author.find().then( (authors) => {
    authorsList = authors;
    next();
  });

};

function getBooks (req, res, next) {
  console.log("Finding books");
  Book.find().then( (books) => {
    console.log("Books found: ", books);
    booksList = books;
    next();
  })
}

function getAuthor (req, res, next){
  console.log("Getting book author...");
  Author.findById(req.body.author).then( (author) => {
    console.log("The author of the book is: ", author);
    bookAuthor = author;
    next();
  });
};
////////////////////////////////////////////////////////////////////////////////
router.get("/", getAuthors, getBooks, (req, res) => {
  res.render("index", {authors: authorsList, books: booksList});
});

router.post("/add/:item", getAuthor, (req, res) => {
  switch (req.params.item){
    case "book":
      console.log("Creating a book!");
      console.log("The author of this book is: ", bookAuthor.fullName);
      var errors = validateBook(req);
      if(errors) renderErrors(errors, res);
      else{
        let newBook = new Book(buildBook(req.body, bookAuthor));
        console.log("Book created: ", newBook);
        newBook.save().then( (newBook) => {
          res.redirect("/");
        });
      }
      break;
    case "author":
      var errors = validateAuthor(req);
      if(errors) renderErrors(errors, res);
      else{
        let newAuthor = new Author(buildAuthor(req.body));
        console.log("Author created: ", newAuthor);
        newAuthor.save().then( (newAuthor) => {
          res.redirect("/");
        });
      }
      break;
    default:
      res.redirect("/");
      break;
  }
});

router.post("/book/update/:id", getAuthors, (req, res) => {
  Book.findById(req.params.id).then( (Book) =>{
    console.log("Book to update: ", Book);
    res.render("update", {book: Book, authors: authorsList});
  });
});

router.post("/book/update/:id/done", getAuthor, (req, res) => {
  Book.update(
    {"_id": req.params.id},
    {
      $set: {
        "title": req.body.title,
        "isbnNumber": Number(req.body.isbn),
        "length": Number(req.body.length),
        "haveRead": req.body.haveRead ? true:false,
        "author": bookAuthor
      }
    }
  ).then( (book) => {
    console.log("The book is now: ", book);
    res.redirect("/");
  });
});
////////////////////////////////////////////////////////////////////////////////
module.exports = router;
