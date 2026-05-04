import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import jwt from "jsonwebtoken";
import { prisma } from "../../utils/prisma";
import { LoginAdminSchema, RegisterAdminSchema } from "./schema";
import { hashPassword, isPasswordValid } from "./utils";
import "dotenv/config";
import { env } from "process";
import { process } from "zod/v4/core";

export const authRouter = new Hono()
	.post("/register", zValidator("json", RegisterAdminSchema), async (c) => {
		const { name, email, password } = c.req.valid("json");

		// check collision -> registered?
		const user = await prisma.admin.findUnique({
			where: {
				email,
			},
		});
		if (user) {
			return c.json({ message: "Already Registered" }, 409);
		}

		console.time("hash");
		const hashedPassword = await hashPassword(password);
		console.timeEnd("hash");

		const newUser = await prisma.admin.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		const filteredData = {
			id: newUser.id,
			name: newUser.name,
			email: newUser.email,
		};
		return c.json(filteredData);
	})
	.post("/login", zValidator("json", LoginAdminSchema), async (c) => {
		const { email, password } = c.req.valid("json");

		// check if user exists
		const user = await prisma.admin.findUnique({
			where: {
				email,
			},
		});

		if (!user) {
			return c.json({ error: "Invalid Credentials" }, 401);
		}

		// check if password correct
		const isValid = await isPasswordValid(password, user.password);
		if (!isValid) {
			return c.json({ error: "Invalid Credentials" }, 401);
		}

		// Authorization
		// Access Token
		const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
		const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
		if (!ACCESS_TOKEN_SECRET || REFRESH_TOKEN_SECRET) {
			throw new Error(
				"ACCESS_TOKEN_SECRET or REFRESH_TOKEN_SECRET is not defined.",
			);
		}

		const accessToken = jwt.sign({ sub: user.id }, ACCESS_TOKEN_SECRET, {
			expiresIn: "15m",
		});
		const refreshToken = jwt.sign({ sub: user.id }, ACCESS_TOKEN_SECRET, {
			expiresIn: "7d",
		});

		return c.json({ accessToken, refreshToken });
	});
