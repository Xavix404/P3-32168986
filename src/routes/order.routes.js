import { Router } from "express";
import { processOrder } from "../controllers/ordersController.js";

const router = Router();

router.post("/", processOrder);

export default router;
