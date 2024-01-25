import express from 'express';
import fs from 'fs/promises'; // Import the fs module to read the JSON file
console.log('Mock member router is loaded.'); // Add this line

const router = express.Router();

// Mock data for testing purposes
let mockMembers;

// Load the mock data from the JSON file
try {
    const data = await fs.readFile('./utils/members.json', 'utf8');
    mockMembers = JSON.parse(data);
} catch (error) {
    console.error('Error loading mock data:', error);
    mockMembers = [];
}

router.get('/', (req, res) => {
    try {
        return res.status(200).json(mockMembers);
    } catch (error) {
        console.error('Error fetching members:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});

router.get('/:id', (req, res) => {
    try {
        if (req.query.simulateError === 'true') {
            throw new Error('Simulated internal server error');
        }
        const memberId = req.params.id;
        const result = mockMembers.find(member => member._id === memberId);

        if (result) {
            return res.status(200).json(result);
        } else {
            return res.status(404).send({ message: 'Member not found' });
        }
    } catch (error) {
        console.error('Error fetching member by ID:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
});

export default router;
