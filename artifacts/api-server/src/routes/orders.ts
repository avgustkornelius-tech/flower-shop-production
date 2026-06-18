import { Router, type IRouter } from "express";
import { db, ordersTable, productsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import {
  CreateOrderBody,
  GetOrderParams,
  GetOrderResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, ...rest } = parsed.data;
  const productIds = items.map((i) => i.productId);
  const products = await db
    .select()
    .from(productsTable)
    .where(inArray(productsTable.id, productIds));

  const productMap = new Map(products.map((p) => [p.id, p]));
  let totalPrice = 0;
  const orderItems: Array<{ productId: number; productName: string; quantity: number; price: number }> = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    if (!product) {
      res.status(400).json({ error: `Product ${item.productId} not found` });
      return;
    }
    const lineTotal = product.price * item.quantity;
    totalPrice += lineTotal;
    orderItems.push({
      productId: product.id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price,
    });
  }

  const [order] = await db
    .insert(ordersTable)
    .values({ ...rest, totalPrice, items: orderItems, status: "pending" })
    .returning();

  const serialized = { ...order, items: orderItems, createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt };
  res.status(201).json(GetOrderResponse.parse(serialized));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetOrderParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid order ID" });
    return;
  }
  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, parsed.data.id));
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }
  const serialized = { ...order, createdAt: order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt };
  res.json(GetOrderResponse.parse(serialized));
});

export default router;
