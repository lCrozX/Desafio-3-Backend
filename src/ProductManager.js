const fs = require('fs');

class ProductManager {
  constructor(filePath) {
    this.path = filePath;
  }

  addProduct(product) {
    const products = this.getProducts();
    const lastProduct = products[products.length - 1];
    const newId = lastProduct ? lastProduct.id + 1 : 1;
    const newProduct = { ...product, id: newId };
    if (this.getProductByCode(newProduct.code)) {
      throw new Error('Product code already exists');
    }
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products));
    return newProduct;
  }

  getProducts() {
    try {
      const productsData = fs.readFileSync(this.path, 'utf-8');
      const products = JSON.parse(productsData);
      return products;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  }

  getProductByCode(code) {
    const products = this.getProducts();
    const product = products.find((p) => p.code === code);
    return product;
  }

  updateProduct(id, newProductData) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    const updatedProduct = { ...products[productIndex], ...newProductData };
    if (updatedProduct.code !== products[productIndex].code) {
      if (this.getProductByCode(updatedProduct.code)) {
        throw new Error('Product code already exists');
      }
    }
    products[productIndex] = updatedProduct;
    fs.writeFileSync(this.path, JSON.stringify(products));
    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const productIndex = products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }
    products.splice(productIndex, 1);
    fs.writeFileSync(this.path, JSON.stringify(products));
  }
}

module.exports = ProductManager;
