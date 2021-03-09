module.exports = {
    development: {
        client: 'postgres',
        connection: {
            host: 'localhost',
            port: 9090,
            password: 'password',
            charset: 'utf8',
            database: 'database',
            user: 'postgres'
        },
        useNullAsDefault: true,
    }
};
