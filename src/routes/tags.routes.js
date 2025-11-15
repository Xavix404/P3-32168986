import { Router } from "express";
import {
  getTags,
  getTagsById,
  createTags,
  updateTags,
  deleteTags,
} from "../controllers/tagsController.js";
import validateAuthorization from "../middleware/validateAuthorization.js";

const router = Router();

router.use(validateAuthorization);

router.get("/", getTags);
router.get("/:id", getTagsById);
router.post("/", createTags);
router.put("/:id", updateTags);
router.delete("/:id", deleteTags);

export default router;
