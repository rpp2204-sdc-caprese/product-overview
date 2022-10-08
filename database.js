const { Client } = require('pg');

function Query(id, res){
  const credentials = {
    user: "postgres",
    host: "localhost",
    database: "products",
    password: "Post*1337",
    port: 5432
  };

  const client = new Client(credentials);

  client.connect();

  client.query("select * from product where id=" + id, (err, response) => {
    if(!err){
      console.log(response);
      res.send(response.rows[0])
    } else {
      console.log(err);
      res.send('Sorry Charlie, there was an error')
    }
    client.end();
  });
}

module.exports = Query;