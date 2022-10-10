const { Client } = require('pg');

const credentials = {
  user: "postgres",
  host: "localhost",
  database: "products",
  password: "Post*1337",
  port: 5432
};

const Query = {
  getProductInfo: function(id, res){
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
  },
  getProducts: function(res){
    const client = new Client(credentials);

    client.connect();

    client.query("SELECT * FROM product LIMIT 10;", (err, response) => {
      if(!err){
        res.send(response.rows);
      } else {
        console.log(err);
        res.send('Sorry Charlie, there was an error')
      }
      client.end();
    });
  },
  getStyles: function(productId, res){
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
}


module.exports = Query;