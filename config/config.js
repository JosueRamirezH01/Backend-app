const { ConfigModule } = require('@nestjs/config');
require('dotenv').config();
const promise = require('bluebird');
const options ={
    promiseLib: promise,
    query: (e) =>{}
}
const pgp = require('pg-promise')(options);
const types = pgp.pg.types;
types.setTypeParser(1114, function(stringValue){
    return stringValue;
});
const databaseConfig = {
    'host': process.env.POSTGRES_HOST,
    'port': process.env.POSTGRES_PORT,
    'database': process.env.POSTGRES_DATABASE,
    'user': process.env.POSTGRES_USERNAME,
    'password': process.env.PGPASSWORD,
    'ssl': process.env.POSTGRES_SSL
};

const db = pgp(databaseConfig);
module.exports = db;