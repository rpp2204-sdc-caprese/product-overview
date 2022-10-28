const { Client } = require('pg');
require("dotenv").config();
const credentials = {
  user: process.env.USERNAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PGPORT
};

const client = new Client(credentials);

client.connect();

const Query = {
  getProductInfo: function(id, res){

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
    });
  },
  getProducts: function(res){

    client.query("SELECT * FROM product LIMIT 10;", (err, response) => {
      if(!err){
        let products = response.rows;
        for(let i = 0; i < products.length; i++){
          products[i].default_price = products[i].default_price.toString() + ".00";
        }
        res.send(products);
      } else {
        console.log(err);
        res.statusCode(500).send('Sorry Charlie, there was an error')
      }
    });
  },
  getStyles: function(product_number, res){

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
        const allPhotos = {};

        response.rows.map((row) => {
          let {id, name, original_price, productId, sale_price, style, styleid, thumbnail_url, url, quantity, size} = row;
          if(allStyles[styleid] === undefined){
            if(sale_price === "null"){
              sale_price = null;
            }
          if(style === 0){
            style = false
          } else {
            style = true
          }
            allStyles[styleid] = {
              "style_id": styleid,
              "name": name,
              "original_price": original_price.toString() + ".00",
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

            allPhotos[thumbnail_url] = thumbnail_url;

          } else if (allStyles[styleid].skus[id] === undefined) {
            allStyles[styleid].skus[id] = {
                  "quantity": quantity,
                  "size": size
              }
          } else {
            if(allPhotos[thumbnail_url] === undefined){
              allStyles[styleid].photos.push({
                url: url,
                thumbnail_url: thumbnail_url
              })
              allPhotos[thumbnail_url] = thumbnail_url;
            }

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
    });
  },
  getRelated: function(id, res){

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