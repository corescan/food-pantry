module.exports = {
    pg: {
        host: 'postgres',		
        user: 'postgres',
        pass: 'password',
        database: 'food_pantry',
        port: 5432
    },
    server: {
        port: 9000,
        static: '../www'
    }
}