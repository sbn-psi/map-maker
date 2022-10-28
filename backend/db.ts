import pkg from 'knex'
const pg = pkg.knex({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['public'],
});

export default pg;