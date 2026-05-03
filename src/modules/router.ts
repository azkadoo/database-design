import { Hono } from "hono";

export const router = new Hono().get("/", (c)=>{
    return c.json({message: "Hello"})
})