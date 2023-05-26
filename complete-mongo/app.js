const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const { connectToDb, getDb } = require(__dirname + '/db.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let db;

connectToDb(err => {
    if (!err) {
        app.listen(8000, 'localhost', () => {
            console.log('App listening on port ' + 8000);
        });
        db = getDb();
    }
});

app.get('/books', (req, res) => {
    const bookPerPage = 3;
    const page = req.query.page || 0;

    let books = [];
    db.collection('books')
        .find()
        .sort({ author: 1 })
        .skip(page * bookPerPage)
        .limit(bookPerPage)
        .forEach(book => books.push(book))
        .then(() => {
            res.status(200).json(books);
        })
        .catch(err => {
            res.status(500).json({ message: 'Could not fetch books' });
        });
});

app.get('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    if (ObjectId.isValid(bookId)) {
        db.collection('books')
            .findOne({ _id: new ObjectId(bookId) })
            .then(book => {
                res.status(200).json(book);
            })
            .catch(err => {
                res.status(500).json({ message: 'Could not find book' });
            });
    } else {
        res.status(500).json({ message: 'Not valid doc id' });
    }
});

app.delete('/books/:bookId', (req, res) => {
    const { bookId } = req.params;
    if (ObjectId.isValid(bookId)) {
        db.collection('books')
            .deleteOne({ _id: new ObjectId(bookId) })
            .then(() => {
                res.status(200).json({
                    code: 200,
                    message: 'Book Deleted Successfully',
                });
            })
            .catch(err => {
                res.status(500).json({ message: 'Could not delete the book!' });
            });
    } else {
        res.status(500).json({ message: 'Not valid doc id!' });
    }
});

app.put('/books/:bookId', (req, res) => {
    const { bookId } = req.params;

    if (ObjectId.isValid(bookId)) {
        
        db.collection('books')
            .updateOne({ _id: new ObjectId(bookId) }, { $set: req.body })
            .then(() => {
                res.status(200).json({
                    code: 200,
                    message: 'Book Updated Successfully',
                });
            })
            .catch(err => {
                res.status(500).json({ message: 'Could not update the book!' });
            });

    } else {
        res.status(500).json({ message: 'Not valid doc id!' });
    }
});

app.post('/books', (req, res) => {
    const book = req.body;

    db.collection('books')
        .insertOne(book)
        .then(() => {
            res.status(201).json({
                code: 201,
                message: 'Book Added Successfully',
            });
        })
        .catch(err => {
            res.status(500).json({ message: 'Error inserting book!' });
        });
});
