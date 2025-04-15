const { MongoClient } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGODB_URL;

async function testConnection() {
    try {
        const client = await MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to the database successfully!');
        await client.close();
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    }
}

testConnection();