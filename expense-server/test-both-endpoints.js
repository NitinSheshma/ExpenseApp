require('dotenv').config();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const testId = '6991f137279e4be27b3e7346';
const serverUrl = 'http://localhost:5001';

// Generate valid JWT
const token = jwt.sign(
    { name: 'Test', email: 'test@test.com', role: 'admin', id: '65900000000000000000000' },
    process.env.JWT_SECRET
);

(async () => {
    try {
        console.log(`\nTesting BOTH endpoints for group ${testId}\n`);
        
        const headers = { 'Cookie': `jwtToken=${token}` };
        
        // Test 1: /groups/{id}
        console.log('1. GET /groups/' + testId);
        try {
            const r1 = await axios.get(`${serverUrl}/groups/${testId}`, { headers });
            console.log(`   SUCCESS: ${r1.status}`);
            console.log(`   Name: ${r1.data.name}`);
        } catch (err) {
            console.log(`   ERROR: ${err.response?.status} - ${err.response?.statusText}`);
            console.log(`   Response: ${JSON.stringify(err.response?.data)}`);
        }
        
        // Test 2: /expenses/group/{id}
        console.log('\n2. GET /expenses/group/' + testId);
        try {
            const r2 = await axios.get(`${serverUrl}/expenses/group/${testId}`, { headers });
            console.log(`   SUCCESS: ${r2.status}`);
            console.log(`   Expenses count: ${r2.data.expenses?.length || 0}`);
        } catch (err) {
            console.log(`   ERROR: ${err.response?.status} - ${err.response?.statusText}`);
            console.log(`   Response: ${JSON.stringify(err.response?.data)}`);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Test error:', error.message);
        process.exit(1);
    }
})();
