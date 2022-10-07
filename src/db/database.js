const { createPool } = require("mysql");

const pool = createPool({
    // host: process.env.PRODUCTION ? process.env.MYSQL_HOST1 : process.env.MYSQL_HOST,
    // user: process.env.PRODUCTION ? process.env.MYSQL_USER1 : process.env.MYSQL_USER,
    // password: process.env.PRODUCTION ? process.env.MYSQL_PASSWORD1 : process.env.MYSQL_PASSWORD,
    // database: process.env.PRODUCTION ? process.env.MYSQL_DATABASE1 : process.env.MYSQL_DATABASE,

    host: "217.21.84.154",
    user: "u109689019_sreehari",
    password: "8497961326@Gs",
    database: "u109689019_qpgweb",
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    acquireTimeout  : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
});


module.exports = pool;

// heroku config:add DATABASE_URL=mysql://u109689019_sreehari:8497961326@Gs@databasehostIP:217.21.84.154/u109689019_qpgweb
// heroku config:add SHARED_DATABASE_URL=mysql://u109689019_sreehari:8497961326@Gs@databasehostIP:217.21.84.154/u109689019_qpgweb