// const dotenv = require('dotenv');
// dotenv.config();

// const MongoClient = require('mongodb').MongoClient;

// let database;

// const initDb = (callback) => {
//     if (database) {
//         console.log('Db is already initialized!');
//         return callback(null, database);
//     }

//     MongoClient.connect(process.env.MONGODB_URL)
//         .then((client) => {
//             database = client;
//             callback(null, database);
//         })
//         .catch((err) => {
//             callback(err);
//         });
// };

// const getDatabase = () => {
//     if (!database) {
//         throw Error('Database not initialized');
//     }
//     return database;
// };

// module.exports = {
//     initDb,
//     getDatabase
// };

const dotenv = require('dotenv');
dotenv.config({ path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env' });

const MongoClient = require('mongodb').MongoClient;

let database;

const initDb = (callback) => {
    if (database) {
        console.log('Db is already initialized!');
        return callback(null, database);
    }

    MongoClient.connect(process.env.MONGODB_URL)
        .then((client) => {
            database = client;
            callback(null, database);
        })
        .catch((err) => {
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Database not initialized');
    }
    return database;
};

const closeDb = async () => {
    if (database) {
        await database.close();
        console.log('Database connection closed.');
    }
};

module.exports = {
    initDb,
    getDatabase,
    closeDb, // Exportar función para cerrar la conexión
};