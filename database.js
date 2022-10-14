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
  getStyles: function(product_number, res){
    const client = new Client(credentials);

    client.connect();

    client.query("SELECT s.id, s.styleId, s.size, s.quantity, sty.name, sty.original_price, sty.sale_price, sty.style, p.thumbnail_url, p.url FROM skus s JOIN styles sty ON s.styleId = sty.id JOIN photos p ON p.styleId = s.styleId  WHERE sty.productId = " + product_number, (err, response) => {
      if(!err){
        const products = {
          "product_id": product_number,
          "results": []
        }

        // const productStyles = {
        //   "syle_id": id,
        //   "name": name,
        //   "original_price": original_price,
        //   "sale_price": description,
        //   "default?": style,
        //   "photos": [],
        //   "skus": []
        // }

        const allStyles = {};

        response.rows.map((row) => {
          const {id, name, original_price, productId, sale_price, style, styleid, thumbnail_url, url, quantity, size} = row;
          if(allStyles[styleid] === undefined){
            allStyles[styleid] = {
              "style_id": styleid,
              "name": name,
              "original_price": original_price,
              "sale_price": sale_price,
              "default?": style,
              "photos": [{
                "thumbnail_url": thumbnail_url,
                "url": url
              }],
              "skus": {
                [id]: {
                  "quantity": quantity,
                  "size": size
                }
              }
            }
          } else if (allStyles[styleid].skus[id] === undefined) {
            allStyles[styleid].skus[id] = {
                  "quantity": quantity,
                  "size": size
              }
              allStyles[styleid].photos.push({
                "thumbnail_url": thumbnail_url,
                "url": url
              })
          } else {
            allStyles[styleid].skus[id] = {
              "quantity": quantity,
              "size": size
            }
          }
        })

        for(let productStyle in allStyles){
          products.results.push(allStyles[productStyle]);
        }

        res.send(products);
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

    client.query('SELECT * FROM related WHERE current_product_id = ' + id, (err, response) => {
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