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
    'host': 'dpg-cmo3rita73kc73b406o0-a.oregon-postgres.render.com',
    'port': 5432,
    'database': 'bd_medico',
    'user': 'bd_medico_user',
    'password': 'Acn5awMU6vRArWl66OMaxFattG0Rp3eK'
};

const db = pgp(databaseConfig);
module.exports = db;