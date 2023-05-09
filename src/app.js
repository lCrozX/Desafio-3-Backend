const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 3002;
const productManager = new ProductManager('./productos.txt');

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();
    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/products/:pid', async (req, res) => {
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(404).send('Producto no encontrado');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
