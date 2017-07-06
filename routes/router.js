const express = require('express');
const router  = express.Router();
////////////////////////////////////////////////////////////////////////////////
//Support Functions
function validateAuthor(req){
  req.checkBody('firstname', "Please enter a first name for the author").notEmpty();
  req.checkBody('lastname', 'Please enter a last name for the author').notEmpty();

  return req.validationErrors();
};

function buildAuthor(data){
  return newAuthor = {
    name: {
      firstname: data.firstname,
      lastname: data.lastname
    },
    address: {
      street: data.street,
      city: data.city,
      zip: data.zip
    }
  }
};

function validateBook(req){
  req.checkBody('title','Please enter a book title').notEmpty();
  req.checkBody('length','Please provide the length of the book').notEmpty();
  req.checkBody('haveRead','Please indicate whether you have read the book').notEmpty();

  return req.validationErrors();
};

function buildBook(data){
  return newBook = {
    title: data.title,
    isbnNumber: data.isbn,
    length: data.length,
    haveRead: data.haveRead ? true : false,
    author: data.author
  }
};

function renderErrors(errors, res){
  let errorMessages = [];
  errors.forEach( (err) => errorMessages.push(err.msg) );
  res.render("index", {errors: errorMessages});
}

////////////////////////////////////////////////////////////////////////////////
router.get("/", (req, res) => {
  res.render("index");
});

router.post("/add/:item", (req, res) => {
  switch (req.params.item){
    case "book":
      var errors = validateBook(req);
      if(errors) renderErrors(errors, res);
      else{
        let newBook = buildBook(req.body);
        res.redirect("/");
      }
      break;
    case "author":
      var errors = validateAuthor(req);
      if(errors) renderErrors(errors, res);
      else{
        let newAuthor = buildAuthor(req.body);
        res.redirect("/");
      }
      break;
    default:
      res.redirect("/");
      break;
  }
});
////////////////////////////////////////////////////////////////////////////////
module.exports = router;
