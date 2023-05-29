const express = require('express');
const mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost:27017/fruitDB');

// const fruitSchema = new mongoose.Schema({
//     name: String,
//     rating: Number,
//     review: String,
// }, {
//     timestamps: true
// });

// const Fruit = mongoose.model('Fruit', fruitSchema);

// const fruit = new Fruit({
//     name: "Apple",
//     rating: 4,
//     review: "Awesome Apple!"
// })

// fruit.save();

//===========================================

mongoose.connect("mongodb://localhost:27017/personsDB");

const personSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const Person = mongoose.model("Person", personSchema);

const dipesh = new Person({
    name: "Hitesh",
    age: 24
});

// dipesh.save()
async function getPeople() {
    const people = await Person.find({}, 'name')
    for(let {name} of people) {
        console.log(name);
    }
    mongoose.connection.close()
}
getPeople()








// const app = express();

// app.get('/', (req, res) => {
//     res.json({code: 200})
// })

// app.listen(8000, 'localhost', () => {
//     console.log("App listening on " + 8000);
// });
