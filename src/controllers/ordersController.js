import OrderService from "../services/orderService.js";
import OrdersRepository from "../repository/ordersRepository.js";
import jwt from "jsonwebtoken";

function getTokenFromReq(req) {
  // Prefer cookie
  if (req.cookies && req.cookies.access_token) return req.cookies.access_token;
  // Fallback to Authorization header: Bearer <token>
  const auth =
    req.headers && (req.headers.authorization || req.headers.Authorization);
  if (!auth) return null;
  const parts = auth.split(" ");
  if (parts.length === 2 && parts[0].toLowerCase() === "bearer")
    return parts[1];
  return null;
}

const orderService = new OrderService();
const ordersRepo = new OrdersRepository();

export async function processOrder(req, res) {
  try {
    const token = getTokenFromReq(req);
    if (!token) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }
    if (!req.body.products) {
      res.status(400).json({ status: "fail", message: "No products" });
      return;
    }

    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }
    const products = req.body.products;

    const data = {
      userId: user.id,
      items: products,
      paymentData: req.body.paymentData,
      paymentMethod: req.body.paymentMethod,
    };

    try {
      const order = await orderService.processOrder(data);
      return res.status(200).json({ status: "success", data: order });
    } catch (err) {
      if (err && err.code === "PAYMENT_FAILED") {
        return res.status(402).json({
          status: "fail",
          message: err.message.replace(/^PAYMENT_FAILED:\s*/i, ""),
        });
      }
      if (err && err.code === "INSUFFICIENT_STOCK") {
        return res.status(400).json({
          status: "fail",
          message: err.message.replace(/^INSUFFICIENT_STOCK:\s*/i, ""),
        });
      }
      throw err;
    }
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
}

export async function getOrders(req, res) {
  try {
    const token = getTokenFromReq(req);
    if (!token)
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 20;
    const uid = parseInt(user.id, 10);
    const result = await ordersRepo.findByUser(uid, page, limit);
    return res.status(200).json({ status: "success", data: result });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}

export async function getOrderById(req, res) {
  try {
    const token = getTokenFromReq(req);
    if (!token)
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(401).json({ status: "fail", message: "Unauthorized" });
    }

    const id = parseInt(req.params.id);
    const order = await ordersRepo.getOrderById(id);
    if (!order)
      return res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
    if (order.userId !== parseInt(user.id, 10))
      return res.status(403).json({ status: "fail", message: "Forbidden" });
    return res.status(200).json({ status: "success", data: order });
  } catch (error) {
    return res.status(500).json({ status: "error", message: error.message });
  }
}
