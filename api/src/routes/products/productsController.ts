import { Request, Response } from "express";
import { db } from "../../db/index.ts";
import { productsTable } from "../../db/productsSchema.ts";
import { eq } from "drizzle-orm";

// Responsible for getting the products (All of them)
export async function listProducts(req: Request, res: Response) {
  try {
    const products = await db.select().from(productsTable);
    res.json(products);
  } catch (e) {
    res.status(500).send(e);
  }
}

// Responsible for getting a spacific single product
export async function getProductById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const [product] = await db
      .select()
      .from(productsTable)
      .where(eq(productsTable.id, Number(id)));

    if (!product) {
      res.status(404).send({ message: "Product not found" });
    } else {
      res.json(product);
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

// Responsible for creating a new product
export async function createProduct(req: Request, res: Response) {
  try {
    const [product] = await db
      .insert(productsTable)
      .values(req.body)
      .returning();

    res.status(201).json(product);
  } catch (e) {
    res.status(500).send("Failed to create the product please try again" + e);
  }
}

// Here is the route to update a single product using its id
export async function updateProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const updatedFields = req.body;
    const [product] = await db
      .update(productsTable)
      .set(updatedFields)
      .where(eq(productsTable.id, id))
      .returning();

    if (product) {
      res.send("Product was updated successfully");
    } else {
      res.status(404).send({ message: "Product was not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}

// The one responsible for deleting a product
export async function deleteProduct(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const [deletedProduct] = await db
      .delete(productsTable)
      .where(eq(productsTable.id, id))
      .returning();
    if (deletedProduct) {
      res.status(204).send("Product deleted successfully");
    } else {
      res.status(404).send({ message: "Product was not found" });
    }
  } catch (e) {
    res.status(500).send(e);
  }
}
