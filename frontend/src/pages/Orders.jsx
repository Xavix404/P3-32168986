import React, { useEffect, useState } from "react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/orders", { credentials: "include" });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Error cargando órdenes");
        // backend returns either an array or a paginated object { items, meta }
        const payload = json.data;
        if (Array.isArray(payload)) {
          setOrders(payload);
          setMeta(null);
        } else if (payload && Array.isArray(payload.items)) {
          setOrders(payload.items);
          setMeta(payload.meta || null);
        } else {
          setOrders([]);
          setMeta(null);
        }
      } catch (err) {
        setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-linear-to-b from-slate-900 via-indigo-900 to-sky-800 text-slate-100">
      <div className="max-w-4xl mx-auto bg-black/40 p-6 rounded-xl border border-indigo-500/20">
        <h2 className="text-2xl text-cyan-100 mb-4">Mis órdenes</h2>
        {loading && <div className="text-slate-300">Cargando...</div>}
        {error && <div className="text-rose-400">{error}</div>}
        {!loading && !error && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="text-slate-300">No hay órdenes.</div>
            )}
            {orders.map((o) => {
              const items = o.orderItems || o.items || [];
              const computedTotal =
                o.totalAmount ||
                o.total ||
                o.amount ||
                items.reduce(
                  (s, it) =>
                    s + (it.unitPrice || it.price || 0) * (it.quantity || 0),
                  0,
                );
              return (
                <div key={o.id} className="bg-slate-800/40 p-4 rounded">
                  <div className="flex justify-between">
                    <div>
                      <div className="text-cyan-100 font-semibold">
                        Orden #{o.id}
                      </div>
                      <div className="text-sm text-slate-300">
                        Estado: {o.state || o.status || "-"}
                      </div>
                      <div className="mt-2 space-y-1">
                        {items.map((it, idx) => (
                          <div
                            key={idx}
                            className="text-sm text-slate-300 flex justify-between"
                          >
                            <div>
                              {it.product?.name || it.name || "Ítem"} x
                              {it.quantity}
                            </div>
                            <div>
                              {(it.unitPrice || it.price || 0) *
                                (it.quantity || 0)}{" "}
                              ✦
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-cyan-200 font-semibold">
                      Total: {computedTotal} ✦
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
