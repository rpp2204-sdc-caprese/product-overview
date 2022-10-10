  const express = require('express');
  const app = express();
  const Query = require('./database.js');

  app.use(express.json());

  app.get('/products/:productId', (req, res) => {
    Query.getProductInfo(req.params.productId, res);
  })

  app.get('/products/', (req, res) => {
    Query.getProducts(res);
  })

  app.listen(3000, () => {
    console.log('Now listening on port 3000...')
  })