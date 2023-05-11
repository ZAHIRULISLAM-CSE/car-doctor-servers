const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});



const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.tzxjncj.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const carDoctorServices=client.db("carDoctorDb").collection("services")
    const carDoctorBookings=client.db("carDoctorDb").collection("bookings")

    app.get('/services',async(req,res)=>{
        const query = {};
        const options = {
            projection: {title: 1, img: 1, price:1 },
        };

        const cursor = carDoctorServices.find(query,options);
        const result =await cursor.toArray();
        res.send(result);
    })

    app.get("/services/:id",async(req,res)=>{
            const id =req.params.id;
            const query={_id: new ObjectId(id)}
            const result = await carDoctorServices.findOne(query);
            res.send(result);      
    })

    app.post("/bookings",async (req,res)=>{
        const orderData=req.body;
        const result = await carDoctorBookings.insertOne(orderData);
        res.send(result);
    } )







    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
