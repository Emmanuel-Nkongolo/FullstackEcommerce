import { Router } from "express";
import { Request, Response } from "express";
import {
  createUserSchema,
  loginSchema,
  usersTable,
} from "../../db/usersSchema";
import { validateData } from "../../middlewares/validationMiddleware";
import bcrypt from "bcryptjs";
import { db } from "../../db/index";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const router = Router();

router.post(
  "/register",
  validateData(createUserSchema),
  async (req: Request, res: Response) => {
    try {
      const data = req.cleanBody;
      data.password = await bcrypt.hash(data.password, 10);

      const [user] = await db.insert(usersTable).values(data).returning();

      const { password, role, ...safeUser } = user;

      // user.password = undefined;

      res.status(201).json({ safeUser });
    } catch (e) {
      res.status(500).send("Something went wrong");
    }
  }
);

router.post(
  "/login",
  validateData(loginSchema),
  async (req: Request, res: Response) => {
    try {
      const { email, password } = req.cleanBody;

      const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

      if (!user) {
        res.status(401).json({ error: "Authentication failed" });
        return;
      }

      const matched = await bcrypt.compare(password, user.password);

      if (!matched) {
        res.status(401).json({ error: "Authentication failed" });
        return;
      }

      // create a jwt token

      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.SECRET!,
        { expiresIn: "30d" }
      );

      let { password: _, ...safeUser } = user;

      res.status(200).json({ token, safeUser });
      console.log(email, password);
    } catch (e) {
      res.status(500).send("Something went wrong");
    }
  }
);

export default router;
