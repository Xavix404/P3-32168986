import jwt from "jsonwebtoken";

export default function validateAuthorization(req, res, next) {
  const token = req.cookies.access_token;
  try {
    if (!token) {
      return res
        .status(401)
        .json({ status: "fail", message: "Access not authorized" });
    }
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (user.rol !== "admin")
      return res
        .status(401)
        .json({ status: "fail", message: "Access not authorized" });
    return next();
  } catch (err) {
    return res
      .status(401)
      .json({ status: "fail", message: "Invalid or expired token" });
  }
}
