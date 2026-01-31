import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, updateItem, removeItem, total } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-linear-to-b from-slate-900 via-indigo-900 to-sky-800 text-slate-100">
      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-indigo-500/20">
        <h2 className="text-2xl text-cyan-100 mb-4">Carrito</h2>
        {cart.length === 0 ? (
          <div>
            <p className="text-slate-300">Tu carrito está vacío.</p>
            <Link to="/products" className="text-cyan-300 hover:underline">
              Volver al catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((it) => (
              <div
                key={it.productId}
                className="flex items-center justify-between bg-slate-800/40 p-3 rounded"
              >
                <div>
                  <div className="font-semibold text-cyan-100">{it.name}</div>
                  <div className="text-sm text-slate-300">{it.price} ✦</div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    value={it.quantity ?? 1}
                    onChange={(e) =>
                      updateItem(
                        it.productId,
                        Math.max(1, parseInt(e.target.value || 1)),
                      )
                    }
                    className="w-20 p-1 rounded bg-slate-800/60 text-slate-100"
                  />
                  <button
                    onClick={() => removeItem(it.productId)}
                    className="px-3 py-1 rounded bg-rose-600 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-between">
              <div className="text-slate-300">Total:</div>
              <div className="text-cyan-200 font-semibold">{total} ✦</div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => navigate("/products")}
                className="px-4 py-2 rounded bg-slate-700"
              >
                Seguir comprando
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="px-4 py-2 rounded bg-cyan-600 text-slate-900 font-semibold"
              >
                Ir al pago
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
