const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aws78to.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const carCollections = client.db('funCarPlayDB').collection('cars');

        app.get('/cars', async(req, res) => {
            const cars = await carCollections.find().toArray();
            res.send(cars);
        })

        app.get('/cars/:category', async(req, res) => {
            const subCategory = req.params.category;
            const result = await carCollections.find({sub_category: subCategory}).toArray();
            res.send(result);
        })

        app.get('/singleCar/:id', async(req, res) => {
            const id = req.params.id;
            const car = {_id: new ObjectId(id)}
            const result = await carCollections.findOne({_id: new ObjectId(req.params.id)});
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('fun car play server is running')
})

app.listen(port, () => {
    console.log(`fun car play server is running on port ${port}`)
})