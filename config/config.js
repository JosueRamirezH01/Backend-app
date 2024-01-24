const { ConfigModule } = require('@nestjs/config');
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
    'host': 'salt.db.elephantsql.com',
    'port': 5432,
    'database': 'qtyudfnq',
    'user': 'qtyudfnq',
    'password': 'BHUXXWo6B-YFehPPQhZgzeEw5mx9Mp-y'
};

const db = pgp(databaseConfig);
module.exports = db;