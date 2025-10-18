import { Router } from "express";
var router = Router();

/* GET página principal. */
router.get("/", (_req, res) => {
  res.send("Chamo que coño esta pasando???");
});

export default router;
