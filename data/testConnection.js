const { MongoClient } = require('mongodb');
require('dotenv').config({ path: './.env' }); // Asegúrate de cargar dotenv
console.log('MONGODB_URL:', process.env.MONGODB_URL); // Verifica que la URL sea correcta

const url = process.env.MONGODB_URL;

async function testConnection() {
    try {
        console.log('Connecting to:', url); // Verifica que la URL sea correcta
        const client = await MongoClient.connect(url); // Sin opciones obsoletas
        console.log('Connected to the database successfully!');
        await client.close();
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
    }
}

testConnection();