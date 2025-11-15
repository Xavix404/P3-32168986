import { Router } from "express";
import {
  getRarity,
  getRarityById,
  createRarity,
  updateRarity,
  deleteRarity,
} from "../controllers/rarityController.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.use(validateAuthorization);

router.get("/", getRarity);
router.get("/:id", getRarityById);
router.post("/", createRarity);
router.put("/:id", updateRarity);
router.delete("/:id", deleteRarity);

export default router;
