export class PaymentStrategy {
  async processPayment(paymentData) {
    throw new Error("processPayment() not implemented");
  }

  // back-compat alias for older implementations
  async pay(paymentData) {
    return this.processPayment(paymentData);
  }
}

export class CreditCardPaymentStrategy extends PaymentStrategy {
  constructor(endpoint = "https://fakepayment.onrender.com/payments") {
    super();
    this.endpoint = endpoint;
  }

  async processPayment(paymentData) {
    const body = paymentData;

    const res = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FAKEPAYMENTAPI_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Try to parse error message if available
      let errText = `Payment provider error ${res.status}`;
      try {
        const json = await res.json();
        if (json && json.message) errText = json.message;
      } catch (e) {
        // ignore parse errors
      }
      return { success: false, error: errText };
    }

    const json = await res.json();
    // Expect provider to return something like { success: true, transactionId }
    if (json && (json.success || json.approved)) {
      return {
        success: true,
        transactionId: json.transactionId || json.id || null,
      };
    }

    return {
      success: false,
      error: json && json.message ? json.message : "Payment declined",
    };
  }

  // back-compat alias
  async pay(paymentData) {
    return this.processPayment(paymentData);
  }
}

export default PaymentStrategy;
