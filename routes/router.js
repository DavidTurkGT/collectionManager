const express = require('express');
const router  = express.Router();
////////////////////////////////////////////////////////////////////////////////
//Support Functions
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
}

function buildBook(data){
  return newBook = {
    title: data.title,
    isbnNumber: data.isbn,
    length: data.length,
    haveRead: data.haveRead ? true : false,
    author: data.author
  }
}

router.get("/", (req, res) => {
  res.render("index");
});

router.post("/add/:item", (req, res) => {
  switch (req.params.item){
    case "book":
      console.log("Adding a book!");
      let newBook = buildBook(req.body);
      console.log("New book created: ", newBook);
      res.redirect("/");
      break;
    case "author":
      console.log("Form received.  Adding author");
      let newAuthor = buildAuthor(req.body);
      console.log("Author created: ", newAuthor);
      res.redirect("/");
      break;
    default:
      res.redirect("/");
      break;
  }
});
////////////////////////////////////////////////////////////////////////////////
module.exports = router;
