const express = require('express')
require('dotenv').config()
var cors = require('cors')
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const app = express()
app.use(cors());
app.use(express.json())
const port = process.env.PORT || 5000

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ex382.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db("realState");
        const allProperties = database.collection("propertiesCollections");
        const allAgent = database.collection("agentsCollections");
        const allBlogs = database.collection("blogsCollections");
        const userCollection = database.collection('users');
        const customerReview = database.collection("customerReviewCollections");

        // post user -
        app.post('/users', async (req, res) => {
            const user = req.body
            const result = await userCollection.insertOne(user);
            console.log(result);
            res.json(result);
        });

        // upsert user -
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await userCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });
        // get user api-
        app.get('/users', async (req, res) => {
            const cursor = userCollection.find({});
            const user = await cursor.toArray();
            res.send(user);
        });



        // find all properties
        app.get('/allProperties', async (req, res) => {
            const cursor = allProperties.find({});
            const properties = await cursor.toArray();
            res.send(properties);
        });

        // get limited properties for homepage
        app.get('/properties', async (req, res) => {
            const cursor = allProperties.find({});
            const properties = await cursor.limit(3).toArray();
            res.send(properties);
        });

        // get all agent
        app.get('/allAgent', async (req, res) => {
            const cursor = allAgent.find({});
            const agents = await cursor.toArray();
            res.send(agents);
        });
        // get all blogs
        app.get('/allBlogs', async (req, res) => {
            const cursor = allBlogs.find({});
            const blogs = await cursor.toArray();
            res.send(blogs);
        });

        // Add Review post
        app.post('/customerReview', async (req, res) => {
            const review = req.body;
            const result = await customerReview.insertOne(review);
            res.json(result);

        });

        // get customer reviews in homepage
        app.get('/customerReview', async (req, res) => {
            const cursor = customerReview.find({});
            const review = await cursor.toArray();
            res.send(review);
        })


        // add property
        app.post('/property', async (req, res) => {
            const user = req.body;
            const result = await allProperties.insertOne(user);
            res.json(result);

        });


        // manage or delete property
        app.delete('/property/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await allProperties.deleteOne(query);
            res.json(result)
        })













    } finally {
        // await client.close();
    }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('hey whats up!!')
})

app.listen(port, () => {
    console.log(`Example app ${port}`)
})