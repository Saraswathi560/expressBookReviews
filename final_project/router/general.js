const express = require('express');
let books = require("./router/books.js");
let isValid = require("./router/auth_user.js").isValid;
let users = require("./router/auth_user.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
return res.status(300).send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  function findbookbyisbn(obj,isbn){
  return new Promise((resolve,reject)=>{
    console.log(obj[isbn]);
    resolve(undefined);
  })
}
const result_isbn=req.params.isbn;
findbookbyisbn(books,result_isbn);
res.send(books[result_isbn]);
 });
  
// Get book details based on author
let result_author=0;
public_users.get('/author/:author',function (req, res) {
 function findbookbyauthor(obj,searchvalue){
  return new Promise((resolve,reject)=>{
    let books_author=[];
    for (let key in books){
      let something=books[key];
      books_author.push(something["author"]);
} 
result_author=(books[(books_author.indexOf(searchvalue))+1]);
resolve(undefined);
  })
} 
const author_value=req.params.author;
findbookbyauthor(books,author_value); 
  return res.send(result_author);
});

// Get all books based on title
let result_title=0;
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  function findbookbytitle(obj,titlevalue){
  return new Promise((resolve,reject)=>{
    let book_title=[];
    for(let key1 in obj){
      let something_title=obj[key1];
      book_title.push(something_title["title"]);
    }
     result_title=(books[(book_title.indexOf(titlevalue))+1]);
    console.log(result_title);
    resolve(undefined);
  })
}
const title_value=req.params.title;
findbookbytitle(books,title_value);
return res.send(result_title);
 });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let review=req.params.isbn;
  let review_ibsn=books[review]["reviews"];
  return res.status(300).json({review_ibsn});
});

module.exports.general = public_users;
