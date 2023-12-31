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
        client.connect();
        const carCollections = client.db('funCarPlayDB').collection('cars');

        app.post('/cars', async(req, res) => {
            const car = req.body;
            const result = await carCollections.insertOne(car);
            res.send(result)
        })

        app.put('/cars/:id', async(req, res) => {
            const id = req.params.id;
            const body = req.body;
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true}
            const updateToy = {
                $set: {
                    price: body.price,
                    quantity: body.quantity,
                    description: body.description,
                }
            };
            const result = await carCollections.updateOne(filter, updateToy, options);
            res.send(result)
        })

        app.delete('/cars/:id', async(req, res) => {
            const id = req.params.id;
           
            const query = {_id: new ObjectId(id)}
            const result = await carCollections.deleteOne(query);
            res.send(result);
        })

        app.get('/cars', async (req, res) => {
            const cars = await carCollections.find().toArray();
            res.send(cars);
        })

        app.get('/cars/:category', async (req, res) => {
            const subCategory = req.params.category;
            const result = await carCollections.find({ sub_category: subCategory }).toArray();
            res.send(result);
        })

        app.get('/singleCars/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await carCollections.findOne(query)
            res.send(result)
        })

        app.get('/getCarByEmail/:email', async(req, res) => {
            const email = req.params.email;
            const query = {seller_email: email}
            const result = await carCollections.find(query).toArray()
            res.send(result)
        })

        app.get("/getCarsByText/:text", async(req, res) => {
            const text = req.params.text;
            const result = await carCollections
                .find({name: { $regex: text, $options: "i" }})
                .toArray();
            res.send(result);
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