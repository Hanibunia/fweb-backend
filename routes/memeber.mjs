import express from "express";
import { db } from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();
router.use(express.json());

router.get("/", async (req, res) => {
    try {

        const simulateError = req.query.simulateError;

        if (simulateError) {
            // Simulate an internal server error
            throw new Error('Simulated internal server error');
        }
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
        const { name, email, photo } = req.body;

        if (!name || !email) {
            return res.status(400).send({ message: 'Name and email are required fields.' });
        }

        console.log('Received request with body:', req.body);

        let newDocument = {
            name,
            email,
            photo: photo || null, // Set to null if photo is not provided
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
        const memberId = req.params.id;
        const updateValues = {
            name: req.body.name,
            email: req.body.email,
            photo: req.body.photo,
        };

        console.log('Updating member with ID:', memberId);
        console.log('Update values:', updateValues);

        let collection = await db.collection("member");
        let result = await collection.updateOne(
            { _id: new ObjectId(memberId) },
            { $set: updateValues }
        );

        console.log('Update result:', result);

        // Check for errors, not just modified count
        if (result.matchedCount > 0 || result.modifiedCount > 0) {
            res.status(200).send({ message: 'Member updated successfully' });
        } else {
            console.log('Member not found.'); // Log that the member was not found

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
            return res.status(404).send({ message: 'Member not found' });
        }
    } catch (error) {
        console.error('Error deleting member:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});


export default router;
