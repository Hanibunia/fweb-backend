import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

// This section will help you get a list of all the records
router.get("/", async (req, res) => {
    let collection = await db.collection("memeber");
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
})


//This section will help you create a new record
router.post("/", async (req,res)=>{
    let newDocument = {
        name: req.body.name,
        email: req.body.email,

    };
    let collection = await db.collection("memeber");
    let result = await collection.insertOne(newDocument);
    res.send(result).status(204);
}
);

export default router;