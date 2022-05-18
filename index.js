const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5pguw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run = async () => {

    try {
        await client.connect();
        const taskCollection = client.db('tasks').collection('task');

        app.post('/task', async (req, res) => {
            const newTask = req.body;
            console.log(newTask);
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        app.get('/tasks', async (req, res) => {
            const email = req?.query?.email;
            const query = { email: email };
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updateTitle = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    // title: updateTitle.title,
                    // description: updateTitle.description,
                    type: updateTitle.type,
                    // email: updateTitle.email
                }
            }
            const result = await taskCollection.updateOne(filter, updateDoc, options);
            res.send(result)
        })

    }
    finally {
        // client.close()
    }

}
run().catch(console.dir);

app.listen(port, () => {
    console.log('To Do list server running in port', port);
})

app.get('/', (req, res) => {
    res.send('Welcome to to-do list app');
})