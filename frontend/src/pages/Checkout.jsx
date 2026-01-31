import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const { cart, clear, total } = useContext(CartContext);
  const { isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [method, setMethod] = useState("credit_card");
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    holder: "",
    expiry: "",
    cvv: "",
    currency: "USD",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    if (!isAuthenticated) return navigate("/login");
    setLoading(true);
    setError(null);
    try {
      // normalize payment method and paymentData to backend expected keys
      const normalizedMethod =
        method === "credit_card"
          ? "credit-card"
          : method === "bank_transfer"
            ? "bank-transfer"
            : method;

      // parse expiry MM/YY or MM/YYYY
      let expMonth = "";
      let expYear = "";
      if (paymentData.expiry) {
        const parts = paymentData.expiry.split("/").map((s) => s.trim());
        if (parts.length >= 2) {
          expMonth = parts[0].padStart(2, "0");
          expYear = parts[1].length === 2 ? `20${parts[1]}` : parts[1];
        }
      }

      const normalizedPaymentData =
        normalizedMethod === "credit-card"
          ? {
              "card-number":
                paymentData.cardNumber || paymentData["card-number"] || "",
              cvv: paymentData.cvv || paymentData.cvv || "",
              "expiration-month":
                expMonth || paymentData["expiration-month"] || "",
              "expiration-year":
                expYear || paymentData["expiration-year"] || "",
              "full-name": paymentData.holder || paymentData["full-name"] || "",
              currency: paymentData.currency || "",
              description: paymentData.description || "",
              reference: paymentData.reference || "",
            }
          : {
              info: paymentData.info || "",
              currency: paymentData.currency || "",
              description: paymentData.description || "",
              reference: paymentData.reference || "",
            };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          products: cart.map((c) => ({
            productId: c.productId,
            quantity: c.quantity,
          })),
          paymentMethod: normalizedMethod,
          paymentData: normalizedPaymentData,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        let errMsg = json.message || "Error procesando pago";
        // Normalize provider/payment errors to a user-friendly message
        if (
          /Payment provider/i.test(errMsg) ||
          res.status === 400 ||
          res.status === 402
        ) {
          errMsg = "Pago fallido";
        }
        setError(errMsg);
        setLoading(false);
        return;
      }
      clear();
      navigate(`/orders`);
    } catch (err) {
      setError("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-linear-to-b from-slate-900 via-indigo-900 to-sky-800 text-slate-100">
      <div className="max-w-3xl mx-auto bg-black/40 p-6 rounded-xl border border-indigo-500/20">
        <h2 className="text-2xl text-cyan-100 mb-4">Checkout</h2>
        <div className="mb-4 text-slate-300">
          Total a pagar: <strong className="text-cyan-200">{total} ✦</strong>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Método de pago
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full p-2 rounded bg-slate-800/60"
            >
              <option value="credit_card">Tarjeta de crédito</option>
              <option value="bank_transfer">Transferencia</option>
            </select>
          </div>

          {method === "credit_card" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                placeholder="Número de tarjeta"
                value={paymentData.cardNumber}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cardNumber: e.target.value })
                }
                className="p-2 rounded bg-slate-800/60"
              />
              <input
                placeholder="Nombre titular"
                value={paymentData.holder}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, holder: e.target.value })
                }
                className="p-2 rounded bg-slate-800/60"
              />
              <input
                placeholder="MM/AA"
                value={paymentData.expiry}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, expiry: e.target.value })
                }
                className="p-2 rounded bg-slate-800/60"
              />
              <input
                placeholder="CVV"
                value={paymentData.cvv}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cvv: e.target.value })
                }
                className="p-2 rounded bg-slate-800/60"
              />
            </div>
          )}

          {method === "bank_transfer" && (
            <div>
              <textarea
                placeholder="Datos de transferencia (simulado)"
                className="w-full p-2 rounded bg-slate-800/60"
                value={paymentData.info || ""}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, info: e.target.value })
                }
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Moneda (USD)"
              value={paymentData.currency}
              onChange={(e) =>
                setPaymentData({ ...paymentData, currency: e.target.value })
              }
              className="p-2 rounded bg-slate-800/60"
            />
            <input
              placeholder="Descripción"
              value={paymentData.description}
              onChange={(e) =>
                setPaymentData({ ...paymentData, description: e.target.value })
              }
              className="p-2 rounded bg-slate-800/60"
            />
            <input
              placeholder="Referencia"
              value={paymentData.reference}
              onChange={(e) =>
                setPaymentData({ ...paymentData, reference: e.target.value })
              }
              className="p-2 rounded bg-slate-800/60"
            />
          </div>

          {error && <div className="text-rose-400">{error}</div>}

          <div className="flex justify-end gap-3">
            <button
              onClick={() => navigate("/cart")}
              className="cursor-pointer px-4 py-2 rounded bg-slate-700"
            >
              Volver
            </button>
            <button
              onClick={handlePay}
              disabled={loading}
              className="cursor-pointer px-4 py-2 rounded bg-cyan-600 text-slate-900 font-semibold"
            >
              {loading ? "Procesando..." : "Pagar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
