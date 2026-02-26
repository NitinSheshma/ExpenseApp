require('dotenv').config();
const mongoose = require('mongoose');
const Group = require('./src/model/group');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI);
        console.log('Connected to MongoDB');
        
        const testId = '6991f137279e4be27b3e7346';
        console.log(`\nSearching for group with ID: ${testId}\n`);
        
        // Test 1: findById
        console.log('Test 1: Using findById()');
        const group1 = await Group.findById(testId);
        console.log(`Result: ${group1 ? 'FOUND - ' + group1.name : 'NOT FOUND'}\n`);
        
        // Test 2: findById with explicit ObjectID
        console.log('Test 2: Using findById with explicit ObjectID');
        const group2 = await Group.findById(mongoose.Types.ObjectId.createFromHexString(testId));
        console.log(`Result: ${group2 ? 'FOUND - ' + group2.name : 'NOT FOUND'}\n`);
        
        // Test 3: find with _id
        console.log('Test 3: Using find() with _id query');
        const group3 = await Group.find({ _id: testId });
        console.log(`Result: ${group3.length > 0 ? 'FOUND - ' + group3[0].name : 'NOT FOUND'}\n`);
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
})();
