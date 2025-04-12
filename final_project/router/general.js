const express = require('express');
let books = require("./booksdb.js");
const axios = require("axios");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
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
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;

    const bookArray = Object.values(books);

    const filtered_books = bookArray.filter(
        (book) => book.author.toLowerCase() === author.toLowerCase()
    );

    if (filtered_books.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }

    res.json(filtered_books);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const bookArray = Object.values(books);

    const filtered_books = bookArray.filter(
        (book) => book.title.toLowerCase() === title.toLowerCase()
    );

    if (filtered_books.length === 0) {
        return res.status(404).json({ message: "No books found for this author" });
    }

    res.json(filtered_books);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

const getBooksUsingAsyncAwait = async () => {
    try {
      const response = await axios.get("/");
      console.log("List of Books (Async/Await):", response.data);
    } catch (error) {
      console.error("Error fetching books:", error.message);
    }
  };

  const getBookByIsbnUsingAsyncAwait = async (isbn) => {
    try {
      const response = await axios.get('/isbn/${isbn}');
      console.log(`Book Details for ISBN ${isbn} (Async/Await):`, response.data);
    } catch (error) {
      console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
    }
  };

  const getBooksByAuthorUsingPromise = (author) => {
    axios.get(`/author/${author}`)
      .then(response => {
        console.log(`Books by ${author} (Promise):`, response.data);
      })
      .catch(error => {
        console.error(`Error fetching books by author ${author}:`, error.message);
      });
  };

  const getBooksByTitleUsingPromise = (title) => {
    axios.get(`/title/${title}`)
      .then(response => {
        console.log(`Books with title "${title}" (Promise):`, response.data);
      })
      .catch(error => {
        console.error(`Error fetching books with title ${title}:`, error.message);
      });
  };
  

module.exports.general = public_users;
