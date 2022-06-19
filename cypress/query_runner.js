const {Client} = require("pg");

const client = new Client({
  host: "aurora-qa.cluster-czyzwdii862u.us-east-1.rds.amazonaws.com",
  user: "clusteradmin",
  port: 5432,
  password: "Jr}&udw?YLeV2r6Ti=O-ahU;23IiM)mc",
  database: "sor",

  // host: "localhost",
  // user: "gopi",
  // port: 5432,
  // password: "root1234",
  // database: "test"
});

client.connect();

client.query(`select * from line_items where account_id = 1503`, (err, res) => {
  if (!err) {
    console.log(res.rows);
  } else {
    console.log(err.message);
  }
  client.end();
});
