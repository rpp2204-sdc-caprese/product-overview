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

  client.query("SELECT * FROM product INNER JOIN features ON features.product_id = product.id WHERE product.id = " + id, (err, response) => {
    if(!err){
      const {name, slogan, description, category, default_price, product_id} = response.rows[0];
      const product = {
        "id": product_id,
        "name": name,
        "slogan": slogan,
        "description": description,
        "category": category,
        "default_price": default_price,
        "features": []

      }
      product.features = response.rows.map((row) => {
        return {
          "feature": row.feature,
          "value": row.value
        }
      })
      res.send(product);
    } else {
      console.log(err);
      res.send('Sorry Charlie, there was an error')
    }
    client.end();
  });
}

module.exports = Query;