const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uuibjb3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// console.log(uri);

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

        const bookCollection = client.db('bookDB').collection('book');
        const borrowedBookCollection = client.db('bookDB').collection('borrowedBook');
        const categoryCollection = client.db('bookDB').collection('category');


        // ------------- book -------------

        app.get('/book', async (req, res) => {
            const cursor = bookCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await bookCollection.findOne(query);
            res.send(result);
        })


        app.post('/book', async (req, res) => {
            const newBook = req.body;
            console.log(newBook);
            const result = await bookCollection.insertOne(newBook);
            res.send(result);
        })


        app.put('/book/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            // const updateBook = req.body;
            const updateBook = req.body;

            const book = {
                $set: {
                    bookName: updateBook.bookName,
                    photo: updateBook.photo,
                    shortDescription: updateBook.shortDescription,
                    authorName: updateBook.authorName,
                    // quantityBook: updateBook.quantityBook,
                    category: updateBook.category,
                    rating: updateBook.rating,
                    contents: updateBook.contents

                }
            }

            const result = await bookCollection.updateOne(filter, book, options);
            res.send(result);
        })

        // ------------- update decrement ----------

        // Decrement the quantityBook field by 1
        app.put('/book/decrement/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const updateBook = req.body;

                // const quantityBook = parseInt(quantityBook);
                const update = {
                    $inc: {
                        quantityBook: -1,
                    }
                };

                // Convert quantityBook field to a numeric type using parseInt
                update.$inc.quantityBook = parseInt(update.$inc.quantityBook);

                console.log(updateBook);
                const result = await bookCollection.updateOne(filter, update);
                res.send(result);
            } catch (error) {
                console.error('Error incrementing quantityBook:', error);
                res.status(500).send({ error: 'Internal server error' });
            }
        });


        // ------------ update increment ------------
        // Increment the quantityBook field by 1
        app.put('/book/increment/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const filter = { _id: new ObjectId(id) };
                const updateBook = req.body;

                // const quantityBook = parseInt(quantityBook);
                const update = {
                    $inc: {
                        quantityBook: 1,
                    }
                };

                // Convert quantityBook field to a numeric type using parseInt
                // update.$inc.quantityBook = parseInt(update.$inc.quantityBook);

                console.log(updateBook);
                const result = await bookCollection.updateOne(filter, update);
                res.send(result);
            } catch (error) {
                console.error('Error incrementing quantityBook:', error);
                res.status(500).send({ error: 'Internal server error' });
            }
        });
        

        // ----------- updt another ---------
        // app.put('/book/decrement/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: new ObjectId(id) };
        //     // const options = { upsert: true };
        //     const updateBook = req.body;
        //     // Construct the update operation with $inc operator for quantityBook field
        //     const updateOperation = {
        //         $inc: {
        //             quantityBook: -1 // Decrement quantityBook by 1
        //         },
        //         $set: {
        //             bookName: updateBook.bookName,
        //             photo: updateBook.photo,
        //             shortDescription: updateBook.shortDescription,
        //             authorName: updateBook.authorName,
        //             // quantityBook: updateBook.quantityBook,
        //             category: updateBook.category,
        //             rating: updateBook.rating,
        //             contents: updateBook.contents
        //         }
        //     };

        
        //     try {
        //         const result = await bookCollection.updateOne(filter, updateOperation);
        //         res.send(result);
        //     } catch (error) {
        //         console.error("Error decrementing book quantity:", error);
        //         res.status(500).send("Error decrementing book quantity");
        //     }
        // });



        app.delete('/book/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await bookCollection.deleteOne(query);
            res.send(result);
        })



        // ------------- borrowedBook -----------
        app.get('/borrowedBook', async (req, res) => {
            const cursor = borrowedBookCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/borrowedBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await borrowedBookCollection.findOne(query);
            res.send(result);
        })


        app.post('/borrowedBook', async (req, res) => {
            const newBorrowedBook = req.body;
            console.log(newBorrowedBook);
            const result = await borrowedBookCollection.insertOne(newBorrowedBook);
            res.send(result);
        })

        app.put('/borrowedBook/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            // const updateSpot = req.body;
            const updateBorrowedBook = req.body;

            const borrowedBook = {
                $set: {
                    bookName: updateBorrowedBook.bookName,
                    bookId: updateBorrowedBook.bookId,
                    photo: updateBorrowedBook.photo,
                    shortDescription: updateBorrowedBook.shortDescription,
                    authorName: updateBorrowedBook.authorName,
                    // quantityBook: updateBorrowedBook.quantityBook,
                    category: updateBorrowedBook.category,
                    rating: updateBorrowedBook.rating,
                    contents: updateBorrowedBook.contents

                }
            }


            const result = await borrowedBookCollection.updateOne(filter, borrowedBook, options);
            res.send(result);
        })


        app.delete('/borrowedBook/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await borrowedBookCollection.deleteOne(query);
            res.send(result);
        })


        // -------------- category -----------

        app.get('/category', async (req, res) => {
            const cursor = categoryCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await categoryCollection.findOne(query);
            res.send(result);
        })

        app.post('/category', async (req, res) => {
            // const newCategory = req.body;
            const category = req.body;
            console.log(category);
            const result = await categoryCollection.insertOne(category);
            res.send(result);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('library is running')
})

app.listen(port, () => {
    console.log(`library Server is running on port: ${port}`)
})