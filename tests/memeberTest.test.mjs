import * as chai from 'chai';
import supertest from 'supertest';
import express from 'express';
import router from '../routes/memeber.mjs';
import { db, closeConnection, client } from '../db/conn.mjs'; // Import db, closeConnection, and client
import sinon from 'sinon';

const { expect } = chai;
const app = express();

// Use the router in your app
app.use('/member', router);
let createdMemberId; // Declare a variable to store the ID of the member created during the test

const request = supertest(app);



before(async () => {
    try {
        // Ensure the client is connected before running tests
        await client.connect();
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
});

it('should get all members', async () => {
    try {
        const res = await request.get('/member');

        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
    } catch (error) {
        console.error('Error during test:', error);
        throw error; // Signal that the test is complete with an error
    }
});

// New test case: Retrieve a member by ID
it('should get a member by ID', async () => {
    try {
        // Assuming there's an existing member ID, replace 'existingMemberId' with an actual ID
        const existingMemberId = '65980270cc4929a69734f0b2';

        const res = await request.get(`/member/${existingMemberId}`);

        expect(res.status).to.equal(200);
        // Add more assertions based on your expected response structure
    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
});

it('should create a new member without affecting the database', async () => {
    try {
        const newMemberData = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            photo: 'path/to/photo.jpg',
        };

        const res = await request.post('/member').send(newMemberData);
        createdMemberId = res.body._id; // Assuming your API returns the ID of the created member
        console.log('Created Member ID:', createdMemberId); // Log the created member ID

        expect(res.status).to.equal(200);
        // Add more assertions based on your expected response structure

    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
});

it('should update a member by ID', async () => {
    try {
        // Assuming there's an existing member ID, replace 'existingMemberId' with an actual ID

        const updatedMemberData = {
            name: 'Updated John Doe',
            email: 'updated.john.doe@example.com',
            photo: 'path/to/updated/photo.jpg',
        };

        const res = await request.put(`/member/${createdMemberId}`).send(updatedMemberData);

        expect(res.status).to.equal(200);
        // Add more assertions based on your expected response structure after updating
    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
});

it('should delete the created member by ID', async () => {
    try {
        const res = await request.delete(`/member/${createdMemberId}`);

        expect(res.status).to.equal(200);
        // Add more assertions based on your expected response structure after deleting
    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
});

it('should return an error if member data is invalid during creation', async () => {
    try {
        const invalidMemberData = {
        };

        const res = await request.post('/member').send(invalidMemberData);

        expect(res.status).to.equal(400); // Expecting a 400 status code for validation error
        // Add more assertions based on your expected response structure
    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
});



it('should handle errors when retrieving a member by an invalid ID', async () => {
    try {
        const invalidMemberId = 'invalidId';

        const res = await request.get(`/member/${invalidMemberId}`);

        expect(res.status).to.equal(500); // Assuming 400 for bad request
        // Add more assertions based on your expected response structure
    } catch (error) {
        console.error('Error during test:', error);
        throw error;
    }
});

after(async () => {
    try {
        // Introduce a delay (e.g., 1000 milliseconds) before closing the MongoDB connection
        setTimeout(async () => {
            await closeConnection();
        }, 1000);
    } catch (error) {
        console.error('Error closing MongoDB connection:', error);
        throw error;
    }
});
