require("dotenv").config();
const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const port = process.env.PORT;
app.use(express.json());

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.status(200).end("Hello World");
});

// Read products - async/await style
app.get("/products", async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "./users_data/products.json"),
      "utf-8"
    );
    const products = JSON.parse(data);
    res.status(200).json(products);
  } catch (err) {
    console.error("Failed to load products:", err);
    res.status(500).json({ error: "Unable to load products" });
  }
});

// Get product by id - read fresh data each time
app.get("/products/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(
      path.join(__dirname, "./users_data/products.json"),
      "utf-8"
    );
    const products = JSON.parse(data);

    const product = products.find((p) => p.id === id);

    if (product) {
      res.setHeader("Cache-Control", "no-store");
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (err) {
    console.error("Failed to fetch product:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Read users - async/await style
const usersFilePath = path.join(__dirname, "./users_data/users.json");

app
  .route("/users")
  .get(async (req, res) => {
    try {
      const data = await fs.readFile(
        path.join(__dirname, "./users_data/users.json"),
        "utf-8"
      );
      const users = JSON.parse(data);
      res.status(200).json(users);
    } catch (err) {
      console.error("Failed to load users:", err);
      res.status(500).json({ error: "Unable to load users" });
    }
  })
  .post(async (req, res) => {
    try {
      const {
        email,
        password,
        gender,
        fullName,
        country,
        reciveNewsLetters,
        DateOfBirth,
      } = req.body;

      if (
        !email ||
        !password ||
        !gender ||
        !fullName ||
        !country ||
        !DateOfBirth
      ) {
        return res.status(400).json({
          error:
            "Missing required fields (email, password, gender, fullName, country, reciveNewsLetters, DateOfBirth)",
        });
      }

      const data = await fs.readFile(usersFilePath, "utf-8");
      const users = JSON.parse(data);

      const newUser = {
        id: users.length ? users[users.length - 1].id + 1 : 1,
        email,
        password,
        gender,
        fullName,
        country,
        reciveNewsLetters,
        DateOfBirth,
      };

      users.push(newUser);

      await fs.writeFile(
        usersFilePath,
        JSON.stringify(users, null, 2),
        "utf-8"
      );

      res.status(201).json({ message: "user added", user: newUser });
    } catch (error) {
      console.error("Failed to add user:", error);
      res.status(500).json({ error: "Failed to save user" });
    }
  });

app.route("/brands").get(async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "./users_data/brands.json"),
      "utf-8"
    );
    const brands = JSON.parse(data);
    res.status(200).json(brands);
  } catch (err) {
    console.error("Failed to load brands:", err);
    res.status(500).json({ error: "Unable to load brands" });
  }
});

app.route("/categories").get(async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "./users_data/categories.json"),
      "utf-8"
    );
    const categories = JSON.parse(data);
    res.status(200).json(categories);
  } catch (err) {
    console.error("Failed to load categories:", err);
    res.status(500).json({ error: "Unable to load categories" });
  }
});

app.route("/orders").get(async (req, res) => {
  try {
    const data = await fs.readFile(
      path.join(__dirname, "./users_data/orders.json"),
      "utf-8"
    );
    const orders = JSON.parse(data);
    res.status(200).json(orders);
  } catch (err) {
    console.error("Failed to load orders:", err);
    res.status(500).json({ error: "Unable to load orders" });
  }
});

app.listen(port, () => {
  console.log(`server running at port ${port}`);
});
