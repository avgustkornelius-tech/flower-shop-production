import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { AiRecommendBody } from "@workspace/api-zod";
import OpenAI from "openai";

const router: IRouter = Router();

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  return new OpenAI({ apiKey });
}

router.post("/ai/recommend", async (req, res): Promise<void> => {
  const parsed = AiRecommendBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { message, history = [] } = parsed.data;

  const products = await db.select().from(productsTable);
  const catalog = products
    .map((p) => `ID:${p.id} | ${p.name} | ${p.category} | ${p.price}₽ | ${p.description.slice(0, 80)}`)
    .join("\n");

  const openai = getOpenAIClient();

  if (!openai) {
    res.json({
      reply: "AI-ассистент временно недоступен. Для использования чат-бота добавьте OPENAI_API_KEY в настройках. Пока что рекомендую посмотреть наш каталог — там много красивых букетов!",
      recommendedProductIds: products.filter((p) => p.isFeatured).slice(0, 3).map((p) => p.id),
    });
    return;
  }

  const systemPrompt = `Ты — Алиса, AI-флорист интернет-магазина цветов "Цветочная". 
Ты помогаешь клиентам выбрать идеальный букет.
Отвечай дружелюбно, лаконично и по-русски.
На основе запроса клиента рекомендуй конкретные букеты из каталога.
В конце ответа ОБЯЗАТЕЛЬНО укажи ID рекомендованных товаров в формате JSON:
[PRODUCTS: 1, 3, 7]

Каталог товаров:
${catalog}`;

  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    { role: "user", content: message },
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    max_tokens: 600,
  });

  const rawReply = completion.choices[0]?.message?.content ?? "Не удалось получить рекомендацию.";

  const productMatch = rawReply.match(/\[PRODUCTS:\s*([\d,\s]+)\]/);
  const recommendedProductIds: number[] = [];
  if (productMatch) {
    productMatch[1].split(",").forEach((id) => {
      const num = parseInt(id.trim(), 10);
      if (!isNaN(num)) recommendedProductIds.push(num);
    });
  }

  const reply = rawReply.replace(/\[PRODUCTS:[\d,\s]+\]/g, "").trim();

  res.json({ reply, recommendedProductIds });
});

export default router;
