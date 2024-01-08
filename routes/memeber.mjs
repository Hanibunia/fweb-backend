import express from "express";
import { db } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
router.use(express.json());

// This section will help you get a list of all the records
router.get("/", async (req, res) => {
    try {
        let collection = await db.collection("member");
        let results = await collection.find({}).toArray();

        return res.send(results).status(200);
    } catch (error) {
        console.error('Error fetching members:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const memberId = req.params.id;
        let collection = await db.collection("member");
        let result = await collection.findOne({ _id: new ObjectId(memberId) });

        if (result) {
            res.status(200).send(result);
        } else {
            res.status(404).send({ message: 'Member not found' });
        }
    } catch (error) {
        console.error('Error fetching member by ID:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});
router.post("/", async (req, res) => {
    try {
        console.log('Received request with body:', req.body);

        let newDocument = {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
        };
        console.log('Creating new document:', newDocument);

        let collection = await db.collection("member");
        let result = await collection.insertOne(newDocument);

        // Send a response with the inserted document's ID
        res.status(200).send({ _id: result.insertedId });
    } catch (error) {
        console.error('Error creating new member:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});


router.put("/:id", async (req, res) => {
    try {
        const memberId = req.params.id; // Use "id" as it matches the parameter in the route
        const updateValues = {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
        };

        let collection = await db.collection("member");
        let result = await collection.updateOne({ _id: new ObjectId(memberId) }, { $set: updateValues });

        if (result.modifiedCount > 0) {
            res.status(200).send({ message: 'Member updated successfully' });
        } else {
            res.status(404).send({ message: 'Member not found' });
        }
    } catch (error) {
        console.error('Error updating member:', error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const memberId = req.params.id;
        let collection = await db.collection("member");
        let result = await collection.deleteOne({ _id: new ObjectId(memberId) });

        if (result.deletedCount > 0) {
            return res.status(200).send({ message: 'Member deleted successfully' });
        } else {
            return sres.status(404).send({ message: 'Member not found' });
        }
    } catch (error) {
        console.error('Error deleting member:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});


export default router;
