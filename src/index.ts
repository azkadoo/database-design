import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRouter } from "./modules/auth/router";
import { productRouter } from "./modules/products/router";

const app = new Hono().route("/", productRouter);

app.route("/auth", authRouter);

app.get("/", (c) => {
	const _data = "hello!";
	return c.text("Hello Hono!");
});

serve(
	{
		fetch: app.fetch,
		port: 8000,
	},
	(info) => {
		console.log(`Server is running on http://localhost:${info.port}`);
	},
);
