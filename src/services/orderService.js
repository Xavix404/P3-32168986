import OrdersRepository from "../repository/ordersRepository.js";
import ProductRepository from "../repository/productRepository.js";
import { CreditCardPaymentStrategy } from "../services/strategies/paymentStrategies.js";

const productRepo = new ProductRepository();
const ordersRepo = new OrdersRepository();

export default class OrderService {
  constructor() {
    // Registry of available payment strategy constructors
    this.paymentStrategies = {
      credit_card: CreditCardPaymentStrategy,
      creditcard: CreditCardPaymentStrategy,
      card: CreditCardPaymentStrategy,
    };
    this.productRepo = productRepo;
    this.ordersRepo = ordersRepo;
  }

  async processOrder(data) {
    const products = await this.productRepo.checkProducts(data.items);
    if (!products) {
      const err = new Error("INSUFFICIENT_STOCK: Products not available");
      err.code = "INSUFFICIENT_STOCK";
      throw err;
    }

    data.items = products;

    // compute total amount from checked products
    const totalAmount = data.items.reduce(
      (s, it) => s + (it.price || 0) * (it.quantity || 0),
      0,
    );

    // if payment is provided, attempt payment before persisting the order
    let paymentSucceeded = false;
    if (data.paymentData) {
      data.paymentData.amount = totalAmount;

      const methodRaw = (data.paymentMethod || "credit_card").toString();
      const key = methodRaw
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/-/g, "_");
      const Strategy = this.paymentStrategies[key] || CreditCardPaymentStrategy;
      const strategy = new Strategy();

      const payment = await strategy.processPayment(data.paymentData);
      if (payment.success) {
        paymentSucceeded = true;
      } else {
        const err = new Error(`PAYMENT_FAILED: ${payment.error}`);
        err.code = "PAYMENT_FAILED";
        throw err;
      }
    }

    // create order with state based on payment result
    if (paymentSucceeded) data.state = "paid";
    const order = await this.ordersRepo.createOrder(data);

    // if payment succeeded, decrement stock
    if (paymentSucceeded) {
      await Promise.all(
        data.items.map((item) =>
          this.productRepo.updateProduct({
            id: item.id,
            disponibility: item.disponibility - item.quantity,
          }),
        ),
      );
    }

    return order;
  }
}
