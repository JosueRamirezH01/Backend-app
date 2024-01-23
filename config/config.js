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
    'host': 'dpg-cmnees8l5elc73ci36dg-a',
    'port': 5432,
    'database': 'app_medico_70o5',
    'user': 'medico',
    'password': 'IWuJ8W6rWbocfBkArUGUf7uSqGc3KCQM'
};

const db = pgp(databaseConfig);
module.exports = db;