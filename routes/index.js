import { Router } from "express";
var router = Router();

/* GET página principal. */
router.get("/haciendoPruebas", function (req, res, next) {
  res.render("index", { title: "Express" });
});

export default router;
