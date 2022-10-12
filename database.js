const { Client } = require('pg');

const credentials = {
  user: "TRiPP",
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
  getStyles: function(id, res){
    const client = new Client(credentials);

    client.connect();

    client.query("SELECT s.styleId, s.size, s.quantity, sty.name, sty.original_price, sty.sale_price, default_style, sty.id, p.thumbnail_url, p.url FROM skus s JOIN styles sty ON s.styleId = sty.productId JOIN photos p ON p.styleId = sty.productId WHERE p.styleId = " + id, (err, response) => {
      if(!err){
        const {name, slogan, description, category, default_price, styleId, id} = response.rows[0];
        const product = {
          "product_id": id,
          "results": []
        }

        const productStyles = {
          "syle_id": id,
          "name": name,
          "original_price": slogan,
          "sale_price": description,
          "default?": category,
          "photos": [],
          "skus": []
        }

        const allStyles = {};

        response.rows.map((row) => {
          const {id} = row;
          if(allStyles[row.id] === undefined){
            allStyles[row.id] = {
              "syle_id": row.id,
              "name": row.name,
              "original_price": row.original_price,
              "sale_price": row.sale_price,
              "default?": row.default_style,
              "photos": [{
                "thumbnail_url": row.thumbnail_url,
                "url": row.url
              }],
              "skus": [{
                id: {
                  "quantity": row.quantity,
                  "size": row.size
                }
              }]
            }
          } else {
            allStyles[row.id].photos.push({
              "thumbnail_url": row.thumbnail_url,
              "url": row.url
            })
            allStyles[row.id].skus.push({
                id: {
                  "quantity": row.quantity,
                  "size": row.size
                }
              })
          }
        })

        res.send(allStyles);
      } else {
        console.log(err);
        res.send('Sorry Charlie, there was an error')
      }
      client.end();
    });
  },
  getRelated: function(id, res){
    const client = new Client(credentials);

    client.connect();

    client.query('SELECT * FROM related WHERE current_id = ' + id, (err, response) => {
      if(!err){
        res.send(response.rows.map((relatedProduct) => {
          return relatedProduct.related_product_id;
        }));
      } else {
        console.log(err);
        res.send('Sorry Charlie, there was an error')
      }
    })
  }
}


module.exports = Query;

/*

SELECT * FROM skus
JOIN styles
ON skus.styleId = styles.productId
JOIN photos
ON photos.styleId = styles.productId
WHERE photos.styleId = 1;

*/

/*
SELECT s.styleId, s.size, s.quantity, sty.name, sty.original_price, sty.sale_price, p.thumbnail_url, p.url
FROM skus s
JOIN styles sty
ON s.styleId = sty.productId
JOIN photos p
ON p.styleId = sty.productId
WHERE p.styleId = 1;
*/