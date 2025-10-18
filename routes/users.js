import { Router } from "express";
var router = Router();

/* GET listado de usuarios. */
router.get("/users", function (req, res, next) {
  res.send("respond with a resource");
});

export default router;
