const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.obcasl9.mongodb.net/?retryWrites=true&w=majority`;
console.log(process.env.DB_USER);
console.log(process.env.DB_PASS);

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
        const taskCollection = client.db("TaskieeDB").collection("tasks");
    
    

    app.post("/addTask", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });
  app.get("/tasks", async (req, res) => {
    try {
      if (!req.query.email) {
        return res.status(400).json({ error: "No email provided" });
      }

      const email = req.query.email;
      const query = { email: email };
      const result = await taskCollection.find(query).toArray();
      res.json(result);



    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


  app.patch("/updateTask", async (req, res) => {
    try {
      const body = req.body;
      if (!req.query.id) {
        return res.status(400).json({ error: "No ID provided" });
      }

      const id = req.query.id;
      console.log(id);
      const query = { _id: new ObjectId(id) };

      const result = await taskCollection.updateOne(query, {
        $set: { category: body.category },
      });
      res.json(result);
    } catch (error) {
      console.error("Error updating request:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  app.delete('/deleteTask', async (req,res) =>{
    try{
     
      if(!req.query.id){
        return res.status(400).json({error:"No ID Provided"})
      }
       const id = req.query.id
       const query = {_id: new ObjectId(id)};
       const result = await taskCollection.deleteOne(query)
       res.json(result);
    }
    catch (error){
      console.error("Error updating request:", error);
      res.status(500).json({error:"Internal sever error"})
    }

  })
    
    
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("the project is working");
});
app.listen(port, () => {
  console.log(`This is server is running on port : ${port}`);
});
