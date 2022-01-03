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

        registration
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user }
            const result = await userCollection.updateOne(filter, updateDoc, options)
        })


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