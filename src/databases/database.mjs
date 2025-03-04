import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'commerce-app'
});

pool.getConnection((error, connection) => {
    if (connection) {
        console.log('Database connected');
        connection.release();
    }
    if (error) {
        console.error('Database connection error:', error);
    }
});

export default pool;