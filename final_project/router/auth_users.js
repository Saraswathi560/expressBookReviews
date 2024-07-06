const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./routes/books.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
 let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
	const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60});

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

//sAdd a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code her
  let isbn = req.params.isbn;
  let add_review=books[isbn];
  let update_username=[];
  if(add_review){
  	let reviews=req.query.review;
    if(isValid(req.body.username)){
    	console.log("I am inside if");
    	add_review["reviews"]=reviews;
    	books[isbn]=add_review;
    }
    else{
    	console.log("I am inside else");
    	if(Object.keys(books[isbn]["reviews"]).length ===0){
    		let new_one_1=reviews;
    		books[isbn]["reviews"]=new_one_1;
    	}else{
    	let new_one=[books[isbn]["reviews"],reviews];
    	books[isbn]["reviews"]=new_one;
    	console.log(new_one);
    }
    }
  		return res.status(300).send(`Book with the isbn ${isbn} updated.`);
  	}
  	else{
  		return res.send("unable to find the book!");
  	}
  });
let count_values=0;
regd_users.delete("/auth/review/:isbn",(req,res) =>{
	let isbn_value=req.params.isbn;
	let username=req.body.username;
	console.log(isbn_value);
	let delete_review=books[isbn_value];
	if(delete_review && authenticatedUser && isValid(req.body.username)){
		 delete_review.reviews={};
		return res.send("Deleted the review");
	}
	if(!isValid(req.body.username) && books[isbn_value]["reviews"].length>0){
		count_values=count_values+1;
		delete delete_review["reviews"][count_values];
		console.log("I am count:"+count_values);
		return res.send("counted updated");
	}
	else{
		delete_review["reviews"]={};
		return res.send("Deleted the review");
	}
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
