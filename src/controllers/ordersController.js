import OrderService from "../services/orderService.js";
import jwt from "jsonwebtoken";

const orderService = new OrderService();

export async function processOrder(req, res) {
  try {
    const token = req.cookies.access_token;
    if (!req.body.products) {
      res.status(400).json({ status: "fail", message: "No products" });
      return;
    }

    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const products = req.body.products;

    const data = {
      userId: user.id,
      items: products,
      paymentData: req.body.paymentData,
    };

    try {
      const order = await orderService.processOrder(data);
      console.log(order);
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
