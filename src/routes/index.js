import { Router } from "express";
import aboutData from "../services/about.json" assert { type: "json" };

var router = Router();

/* GET página principal. */
router.get("/about", (_req, res) => {
  res.json(aboutData);
});

router.get("/ping", (_req, res) => {
  res.status(200), res.send("");
});

export default router;
