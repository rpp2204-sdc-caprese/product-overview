  const express = require('express');
  const app = express();
  const Query = require('./database.js');

  app.use(express.json());

  app.get('/', (req, res) => {
    Query(req.query.product_id, res);
  })

  app.listen(3000, () => {
    console.log('Now listening on port 3000...')
  })