require('dotenv').config();
const mongoose = require('mongoose');
const Group = require('./src/model/group');

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_URI);
        console.log('Connected to MongoDB');
        
        const groups = await Group.find({}).limit(5);
        console.log(`\nFound ${groups.length} groups:\n`);
        groups.forEach((g, i) => {
            console.log(`${i+1}. ID: ${g._id}`);
            console.log(`   Name: ${g.name}`);
            console.log(`   Members: ${g.membersEmail.join(', ')}`);
            console.log('');
        });
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
})();
