require('dotenv').config();
const axios = require('axios');

const testId = '6991f137279e4be27b3e7346';
const serverUrl = 'http://localhost:5001';

(async () => {
    try {
        console.log(`\nTesting GET /groups/${testId}\n`);
        
        // Test without authentication (should fail with 401)
        try {
            const r1 = await axios.get(`${serverUrl}/groups/${testId}`);
            console.log('Without auth: SUCCESS (unexpected!)');
            console.log('Response:', r1.data);
        } catch (err) {
            console.log(`Without auth: ${err.response?.status} - ${err.response?.statusText}`);
        }
        
        // Test with valid JWT
        //Find a valid JWT - let's generate one
        const jwt = require('jsonwebtoken');
        const token = jwt.sign(
            { name: 'Test', email: 'test@test.com', role: 'admin', id: '65900000000000000000000' },
            process.env.JWT_SECRET
        );
        
        console.log(`\nWith valid JWT token:\n`);
        try {
            const r2 = await axios.get(`${serverUrl}/groups/${testId}`, {
                headers: {
                    'Cookie': `jwtToken=${token}`
                }
            });
            console.log('SUCCESS! Status:', r2.status);
            console.log('Group name:', r2.data.name);
            console.log('Full response:', JSON.stringify(r2.data, null, 2));
        } catch (err) {
            console.log(`ERROR: ${err.response?.status} - ${err.response?.statusText}`);
            console.log('Response:', err.response?.data);
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Test error:', error.message);
        process.exit(1);
    }
})();
