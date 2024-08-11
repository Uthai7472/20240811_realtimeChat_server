// 1) Config database
const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    charset: 'utf8mb4'
};

const executeQuery = async (query, params) => {
    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        const [results] = await connection.execute(query, params);
        // console.log('Result: ', results);
        return Promise.resolve(results);
    } catch (error) {
        return Promise.reject(error);
    } finally {
         if (connection) {
            await connection.end();
         }
    }
};

module.exports = {executeQuery};