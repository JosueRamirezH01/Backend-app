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
    'host': 'dpg-cnb72ha1hbls73dlu640-a.frankfurt-postgres.render.com',
    'port': 5432,
    'database': 'appmedicodb',
    'user': 'appmedicodb_user',
    'password': 'lwDME6QhIaeaW4pHMyJUY4XuFEKM5gIE',
    'ssl': true
};

const db = pgp(databaseConfig);
module.exports = db;