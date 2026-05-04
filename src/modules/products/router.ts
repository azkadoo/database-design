import { Hono } from "hono";
import { prisma } from "../../utils/prisma";

export const productRouter = new Hono().get("/", async (c) => {
	const products = await prisma.product.findMany({
		include: {
			category: {
				select: {
					name: true,
					description: true,
				},
			},
		},
	});
	return c.json(products);
});
