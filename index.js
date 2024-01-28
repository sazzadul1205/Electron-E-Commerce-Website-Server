const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@pubelectron.lqbelpc.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
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

    // Collection's
    const productsCollection = client.db("Electron").collection("Products");
    const testimonialsCollection = client
      .db("Electron")
      .collection("testimonials");
    const blogPostsCollection = client.db("Electron").collection("blogPosts");
    const userCollection = client.db("Electron").collection("users");
    const featuredCategoriesCollection = client
      .db("Electron")
      .collection("featuredCategories");
    const specialOffersCollection = client
      .db("Electron")
      .collection("specialOffers");
    const newsLetterCollection = client.db("Electron").collection("newsLetter");
    const featuredBrandsCollection = client
      .db("Electron")
      .collection("featuredBrands");

    // API's
    // User Related
    // view all users
    app.get("/users", async (req, res) => {
      const { email } = req.query;
      if (email) {
        // If email is provided, find a specific user by email
        const query = { email };
        const result = await userCollection.findOne(query);
        return res.send(result);
      } else {
        // If email is not provided, find all users
        const result = await userCollection.find().toArray();
        return res.send(result);
      }
    });
    // // check if the user is admin
    // app.get("/users/admin/:email", async (req, res) => {
    //   const email = req.params.email;
    //   if (email !== req.decoded.email) {
    //     return res.status(403).send({ message: "Forbidden Access" });
    //   }

    //   const query = { email };
    //   const user = await userCollection.findOne(query);
    //   const admin = user?.role === "admin";

    //   res.send({ admin });
    // });
    // Post new user
    app.post("/users", async (req, res) => {
      const request = req.body;
      const result = await userCollection.insertOne(request);
      res.send(result);
    });
    // delete users
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    // Products API
    // view all products
    app.get("/products", async (req, res) => {
      // Get query parameters from the request
      const { arrival, bestSeller, brand, productType, name } = req.query;

      // Create a filter object based on provided parameters
      const filter = {};
      if (arrival) filter.arrival = arrival;
      if (bestSeller) filter.bestSeller = bestSeller === "true"; // Convert string to boolean
      if (brand) filter.brand = brand;
      if (productType) filter.productType = productType;
      if (name) filter.name = new RegExp(name, "i"); // Case-insensitive name search

      // Query the database with the filter
      const result = await productsCollection.find(filter).toArray();

      // Send the result as the response
      res.send(result);
    });

    // testimonials API
    // view all testimonials
    app.get("/testimonials", async (req, res) => {
      const result = await testimonialsCollection.find().toArray();
      res.send(result);
    });

    // blogPosts API
    // view all blogPosts
    app.get("/blogPosts", async (req, res) => {
      const result = await blogPostsCollection.find().toArray();
      res.send(result);
    });

    // featuredCategories API
    // view all featuredCategories
    app.get("/featuredCategories", async (req, res) => {
      const result = await featuredCategoriesCollection.find().toArray();
      res.send(result);
    });
    // Post new featuredCategories
    app.post("/featuredCategories", async (req, res) => {
      const request = req.body;
      const result = await featuredCategoriesCollection.insertOne(request);
      res.send(result);
    });
    // delete featuredCategories
    app.delete("/featuredCategories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await featuredCategoriesCollection.deleteOne(query);
      res.send(result);
    });
    // Update featuredCategories
    app.put("/featuredCategories/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedCategory = req.body;
      const result = await featuredCategoriesCollection.updateOne(query, {
        $set: updatedCategory,
      });
      res.send(result)
    });

    // specialOffers API
    // view all specialOffers
    app.get("/specialOffers", async (req, res) => {
      const result = await specialOffersCollection.find().toArray();
      res.send(result);
    });
    // Post new specialOffers
    app.post("/specialOffers", async (req, res) => {
      const request = req.body;
      const result = await specialOffersCollection.insertOne(request);
      res.send(result);
    });
    // delete specialOffers
    app.delete("/specialOffers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await specialOffersCollection.deleteOne(query);
      res.send(result);
    });
    // Update specialOffers
    app.put("/specialOffers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const updatedOffer = req.body;
      const result = await specialOffersCollection.updateOne(query, {
        $set: updatedOffer,
      });
      res.send(result)
    });

    // newsLetter API
    // view all newsLetter
    app.get("/newsLetter", async (req, res) => {
      const result = await newsLetterCollection.find().toArray();
      res.send(result);
    });
    // Post new newsLetter
    app.post("/newsLetter", async (req, res) => {
      const request = req.body;
      const result = await newsLetterCollection.insertOne(request);
      res.send(result);
    });

    // featuredBrands API
    // view all featuredBrands
    app.get("/featuredBrands", async (req, res) => {
      const result = await featuredBrandsCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Electron-server is Running");
});
app.listen(port, () => {
  console.log(`Electron-server Server is Running On Port ${port}`);
});
