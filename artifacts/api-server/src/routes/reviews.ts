import { Router, type IRouter } from "express";
import { db, reviewsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  ListReviewsQueryParams,
  ListReviewsResponse,
  CreateReviewBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/reviews", async (req, res): Promise<void> => {
  const parsed = ListReviewsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  let query = db.select().from(reviewsTable).$dynamic();
  if (parsed.data.productId !== undefined) {
    query = query.where(eq(reviewsTable.productId, parsed.data.productId));
  }

  const reviews = await query;
  const serialized = reviews.map((r) => ({
    ...r,
    createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : r.createdAt,
  }));
  res.json(ListReviewsResponse.parse(serialized));
});

router.post("/reviews", async (req, res): Promise<void> => {
  const parsed = CreateReviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [review] = await db.insert(reviewsTable).values(parsed.data).returning();

  if (parsed.data.productId) {
    const allReviews = await db
      .select()
      .from(reviewsTable)
      .where(eq(reviewsTable.productId, parsed.data.productId));
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await db
      .update(productsTable)
      .set({ rating: Math.round(avgRating * 10) / 10, reviewCount: allReviews.length })
      .where(eq(productsTable.id, parsed.data.productId));
  }

  res.status(201).json(review);
});

export default router;
