import express from "express";
import productsRouter from "./routes/products/index.ts";

const port = 3000;

const app = express();

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/products", productsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
