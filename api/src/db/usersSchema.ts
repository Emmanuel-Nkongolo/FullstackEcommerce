import { integer, pgTable, text, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  //   Part for the authentication
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 255 }).notNull().default("user"),

  //   Part of the details
  name: varchar({ length: 255 }),
  address: text(),
});

export const createUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  role: true,
});

export const loginSchema = createInsertSchema(usersTable).pick({
  email: true,
  password: true,
});
