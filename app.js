const express = require("express");
const app = express();
const file = "./products.json";
const fs = require("fs");

app.use(express.json());

// middleware
/*app.use((req, res, next) => {
  console.log("app middleware");
  next();
});*/

// read products
function getproducts() {
  const data = fs.readFileSync(file, "utf8");
  return JSON.parse(data || "[]");
}

// save products
function saveproducts(products) {
  fs.writeFileSync(file, JSON.stringify(products, null, 2));
}

// create new product
app.post("/products", (req, res) => {
  const products = getproducts();

  const name = req.body.name;
  const price = parseFloat(req.body.price);

  if (!name || isNaN(price)) {
    return res.status(400).json({ error: "Invalid product data" });
  }

  const newproduct = {
    id: products.length + 1,
    name,
    price,
  };

  products.push(newproduct);
  saveproducts(products);

  res.status(201).json(newproduct);
});

// get all products
app.get("/products", (req, res) => {
  const products = getproducts();
  res.json(products);
});

// get product by id
app.get("/products/:id", (req, res) => {
  const products = getproducts();
  const product = products.find((p) => p.id == req.params.id);
  product ? res.json(product) : res.status(404).send("product not found");
});

// delete product by id
app.delete("/products/:id", (req, res) => {
  let products = getproducts();
  products = products.filter((p) => p.id != req.params.id);
  saveproducts(products);
  res.send("prod deleted");
});

// update by put => replace content
app.put("/products/:id", (req, res) => {
  let products = getproducts();
  const id = parseInt(req.params.id);

  const name = req.body.name;
  const price = parseFloat(req.body.price);

  if (!name || isNaN(price)) {
    return res.status(400).json({ error: "Invalid product data" });
  }

  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).send("product not found");
  }

  products[index] = { id, name, price };
  saveproducts(products);

  res.json(products[index]);
});

// update by patch => update part
app.patch("/products/:id", (req, res) => {
  let products = getproducts();
  const id = parseInt(req.params.id);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).send("product not found");
  }

  if (req.body.name !== undefined) {
    product.name = req.body.name;
  }
  if (req.body.price !== undefined) {
    const price = parseFloat(req.body.price);
    if (isNaN(price)) {
      return res.status(400).json({ error: "Invalid price" });
    }
    product.price = price;
  }

  saveproducts(products);
  res.json(product);
});

app.listen(7000, () => {
  console.log("server running on port 7000");
});
