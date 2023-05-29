const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// =======================================================

mongoose.connect('mongodb://localhost:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model('articles', articleSchema);

const defaultArticles = [
    { title: 'Title 1', content: 'Lorem ipsum!' },
    { title: 'Title 2', content: 'Lorem ipsum!' },
];

// Get all articles
app.get('/articles', async (req, res) => {
    const articles = await Article.find();
    res.status(200).json(articles);
});

// Get Specific article by id
app.get('/articles/:articleId', async (req, res) => {
    const { articleId } = req.params;
    if (mongoose.Types.ObjectId.isValid(articleId)) {
        const article = await Article.findById(articleId);
        if (article) res.status(200).json(article);
        else res.status(400).json({ code: 400, error: 'Invalid ObjectId' });
    } else {
        res.status(400).json({ code: 400, error: 'Invalid ObjectId' });
    }
});

// Create article
app.post('/articles', async (req, res) => {
    const article = new Article({
        title: req.body.title,
        content: req.body.content,
    });

    await article.save();
    res.status(201).json({
        code: 201,
        message: 'Article Inserted Successfully',
    });
});

// Update: get id and replace document (Overwrite)
app.put('/articles/:articleId', async (req, res) => {
    const { articleId } = req.params;
    if (mongoose.Types.ObjectId.isValid(articleId)) {
        await Article.findOneAndReplace({_id: articleId}, req.body);
        
        res.status(200).json({
            code: 200,
            message: 'Article Updated Successfully!',
        });
    } else {
        res.status(400).json({ code: 400, error: 'Invalid ObjectId' });
    }
});

// Update: get id and update document.
app.patch("/articles/:articleId", async (req, res) => {
    const {articleId} = req.params;
    if (mongoose.Types.ObjectId.isValid(articleId)) {
        await Article.findByIdAndUpdate(articleId, req.body);
        res.status(200).json({
            code: 200,
            message: 'Article Updated Successfully!',
        });
    } else {
        res.status(400).json({ code: 400, error: 'Invalid ObjectId' });
    }
});

// Delete Article by id
app.delete('/articles/:articleId', async (req, res) => {
    const { articleId } = req.params;
    if (mongoose.Types.ObjectId.isValid(articleId)) {
        await Article.findByIdAndDelete(articleId)
        res.status(200).json({
            code: 200,
            message: 'Article Deleted Successfully!',
        });
    } else {
        res.status(400).json({ code: 400, error: 'Invalid ObjectId' });
    }
});

// Delete all articles
app.delete('/articles', async (req, res) => {
    await Article.deleteMany();
    res.status(200).json({
        code: 200,
        message: 'All Articles Deleted Successfully',
    });
});

app.listen(8000, 'localhost', () => {
    console.log('App listen on port ' + 8000);
});
