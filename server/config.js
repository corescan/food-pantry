module.exports = {
    pg: {
        host: 'postgres',		
        user: 'postgres',
        pass: 'admin1',
        database: 'food_pantry',
        port: 5432
    },
    server: {
        port: 9000,
        static: '../www'
    },
    data: {
        date: 'dec-22-2021'
    },
    report: {
        filename: 'client_id_map-CURRENT_TIME.csv'
    }
}