import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import ordersRouter from "./orders";
import reviewsRouter from "./reviews";
import aiRouter from "./ai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter);
router.use(ordersRouter);
router.use(reviewsRouter);
router.use(aiRouter);

export default router;
