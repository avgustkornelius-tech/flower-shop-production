import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, gte, lte, and, desc, asc, type SQL } from "drizzle-orm";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductParams,
  GetProductResponse,
  GetFeaturedProductsResponse,
  GetCatalogSummaryResponse,
  CreateProductBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .limit(8);
  res.json(GetFeaturedProductsResponse.parse(products));
});

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { category, minPrice, maxPrice, search, sortBy } = parsed.data;
  const conditions: SQL[] = [];

  if (category) conditions.push(eq(productsTable.category, category));
  if (minPrice !== undefined) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice !== undefined) conditions.push(lte(productsTable.price, maxPrice));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));

  let query = db.select().from(productsTable).$dynamic();
  if (conditions.length > 0) query = query.where(and(...conditions));

  if (sortBy === "price_asc") query = query.orderBy(asc(productsTable.price));
  else if (sortBy === "price_desc") query = query.orderBy(desc(productsTable.price));
  else if (sortBy === "popular") query = query.orderBy(desc(productsTable.reviewCount));
  else query = query.orderBy(asc(productsTable.name));

  const products = await query;
  res.json(ListProductsResponse.parse(products));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const parsed = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid product ID" });
    return;
  }
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, parsed.data.id));
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(GetProductResponse.parse(product));
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [product] = await db.insert(productsTable).values(parsed.data).returning();
  res.status(201).json(GetProductResponse.parse(product));
});

router.get("/catalog/summary", async (_req, res): Promise<void> => {
  const products = await db.select().from(productsTable);
  const categories = [...new Set(products.map((p) => p.category))];
  const prices = products.map((p) => p.price);
  const summary = {
    totalProducts: products.length,
    categories,
    minPrice: prices.length > 0 ? Math.min(...prices) : 0,
    maxPrice: prices.length > 0 ? Math.max(...prices) : 0,
    featuredCount: products.filter((p) => p.isFeatured).length,
  };
  res.json(GetCatalogSummaryResponse.parse(summary));
});

export default router;
