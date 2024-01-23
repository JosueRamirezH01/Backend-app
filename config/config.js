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
    'host': 'postgres://medico:IWuJ8W6rWbocfBkArUGUf7uSqGc3KCQM@dpg-cmnees8l5elc73ci36dg-a/app_medico_70o5',
    'port': 5432,
    'database': 'app_medico',
    'user': 'postgres',
    'password': 'IWuJ8W6rWbocfBkArUGUf7uSqGc3KCQM'
};

const db = pgp(databaseConfig);
module.exports = db;