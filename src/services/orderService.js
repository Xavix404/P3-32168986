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

    let order = await this.ordersRepo.createOrder(data);

    if (data.paymentData) {
      data.paymentData.amount = order.totalAmount;

      const methodRaw = (data.paymentMethod || "credit_card").toString();
      const key = methodRaw
        .toLowerCase()
        .replace(/\s+/g, "_")
        .replace(/-/g, "_");
      const Strategy = this.paymentStrategies[key] || CreditCardPaymentStrategy;
      const strategy = new Strategy();

      const payment = await strategy.processPayment(data.paymentData);
      if (payment.success) {
        order = await this.ordersRepo.updateOrder({
          id: order.id,
          body: { state: "paid" },
        });

        await Promise.all(
          data.items.map((item) =>
            this.productRepo.updateProduct({
              id: item.id,
              disponibility: item.disponibility - item.quantity,
            })
          )
        );
      }
      if (!payment.success) {
        const err = new Error(`PAYMENT_FAILED: ${payment.error}`);
        err.code = "PAYMENT_FAILED";
        throw err;
      }
    }
    return order;
  }
}
