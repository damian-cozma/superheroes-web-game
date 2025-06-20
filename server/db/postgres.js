require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    host:     process.env.PG_HOST     || 'localhost',
    port:     process.env.PG_PORT     || 5432,
    user:     process.env.PG_USER     || 'postgres',
    password: process.env.PG_PASSWORD || 'admin',
    database: process.env.PG_DATABASE || 'platformer_web'
});

pool.on('error', err => {
    console.error('⚠️ Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = pool;
