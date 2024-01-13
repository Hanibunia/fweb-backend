import '../mock/mockmemeber.mjs'; // Import the mock member file
import * as chai from 'chai';
import supertest from 'supertest';
import express from 'express';
import fs from 'fs/promises';
import router from '../mock/mockmemeber.mjs';


const { expect } = chai;
const app = express();
const request = supertest(app.use('/member', router));

// Load JSON data from file (for testing purposes)
const usersFilePath = 'utils/members.json';
let orgContent = '';

before(async () => {
    try {
        orgContent = await fs.readFile(usersFilePath, 'utf8');
        orgContent = JSON.parse(orgContent);
    } catch (error) {
        console.error('Error loading JSON data:', error);
        orgContent = [];
    }
});

after(async () => {
    await fs.writeFile(usersFilePath, JSON.stringify(orgContent), 'utf8');
});

describe('Member API Tests', () => {
    it('should get all members', async () => {
        try {
            const res = await request.get('/member');

            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('array');
        } catch (error) {
            console.error('Error during test:', error);
            throw error;
        }
    });

    it('should get a member by ID', async () => {
        try {
            // Assuming there's an existing member ID, replace 'existingMemberId' with an actual ID
            const existingMemberId = '658bbfe3b51af7b2908f775b';
            const res = await request.get(`/member/${existingMemberId}`);

            expect(res.status).to.equal(200);
            // Add more assertions based on your expected response structure
        } catch (error) {
            console.error('Error during test:', error);
            throw error;
        }
    });
    it('should return 404 for non-existent member ID', async () => {
        try {
            // Assuming there's no member with this ID
            const nonExistentMemberId = 'nonExistentId';
            const res = await request.get(`/member/${nonExistentMemberId}`);

            expect(res.status).to.equal(404);
            expect(res.body.message).to.equal('Member not found');
        } catch (error) {
            console.error('Error during test:', error);
            throw error;
        }
    });
});

