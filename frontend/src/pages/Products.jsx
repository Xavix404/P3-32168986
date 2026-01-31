import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function qs(params) {
  const s = new URLSearchParams();
  for (const k in params) {
    if (params[k] !== undefined && params[k] !== "" && params[k] !== null) {
      s.set(k, params[k]);
    }
  }
  return s.toString();
}

export default function Products() {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useContext(AuthContext);
  const { addItem } = useContext(CartContext);
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tags, setTags] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [page, setPage] = useState(1);

  const [categories, setCategories] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [rarities, setRarities] = useState([]);
  const [selectedRarity, setSelectedRarity] = useState("");

  useEffect(() => {
    // fetch filter lists (categories, tags, rarities)
    fetch("/api/categories")
      .then((r) => r.json())
      .then((j) => setCategories(Array.isArray(j) ? j : j.data || []))
      .catch(() => setCategories([]));

    fetch("/api/tags")
      .then((r) => r.json())
      .then((j) => setAvailableTags(Array.isArray(j) ? j : j.data || []))
      .catch(() => setAvailableTags([]));

    fetch("/api/rarity")
      .then((r) => r.json())
      .then((j) => setRarities(Array.isArray(j) ? j : j.data || []))
      .catch(() => setRarities([]));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const query = qs({
          page,
          search: search || undefined,
          category: category || undefined,
          tags: tags || undefined,
          rarity: selectedRarity || undefined,
          price_min: priceMin || undefined,
          price_max: priceMax || undefined,
        });
        const res = await fetch(`/api/products?${query}`, {
          signal: controller.signal,
        });
        const json = await res.json();
        if (!res.ok)
          throw new Error(json.message || "Error cargando productos");
        setItems(json.data || []);
        setMeta(json.meta || { page: 1, pages: 0, total: 0 });
      } catch (err) {
        if (err.name !== "AbortError") setError(err.message || "Error");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [page, search, category, tags, priceMin, priceMax, selectedRarity]);

  function resetFilters() {
    setSearch("");
    setCategory("");
    setTags("");
    setSelectedRarity("");
    setPriceMin("");
    setPriceMax("");
    setPage(1);
  }

  return (
    <div className="min-h-screen p-6 bg-linear-to-b from-slate-900 via-indigo-900 to-sky-800 text-slate-100">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-cyan-100">
              Gremio de mercaderes
            </h1>
            <p className="text-sm text-slate-300">
              Catálogo — artefactos y objetos de fantasía
            </p>
          </div>
          <div className="space-x-2 flex items-center">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-cyan-300 hover:underline">
                  Iniciar sesión
                </Link>
                <Link to="/register" className="text-cyan-300 hover:underline">
                  Registro
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/cart"
                  className="px-3 py-2 rounded bg-amber-500 text-slate-900 hover:opacity-90"
                >
                  Carrito
                </Link>
                <Link
                  to="/orders"
                  className="px-3 py-2 rounded bg-purple-500 text-slate-950 hover:opacity-90"
                >
                  Orders
                </Link>
                <button
                  onClick={() => {
                    logout();
                    navigate("/products");
                  }}
                  className="cursor-pointer px-3 py-2 rounded bg-rose-600 hover:bg-rose-500 text-white"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </header>

        <section className="bg-black/40 border border-indigo-500/20 rounded-2xl p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Buscar</label>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-800/60 border border-slate-700/50 text-slate-100"
                placeholder="Nombre o descripción"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-800/60 border border-slate-700/50"
              >
                <option value="">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Rareza</label>
              <select
                value={selectedRarity}
                onChange={(e) => setSelectedRarity(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-800/60 border border-slate-700/50"
              >
                <option value="">Todas</option>
                {rarities.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm text-slate-300">Etiquetas</label>
              <select
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-800/60 border border-slate-700/50"
              >
                <option value="">Todas</option>
                {availableTags.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-1 md:grid-cols-4 gap-3">
            <div>
              <label className="text-sm text-slate-300">Precio min</label>
              <input
                value={priceMin}
                onChange={(e) => setPriceMin(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-800/60 border border-slate-700/50"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">Precio max</label>
              <input
                value={priceMax}
                onChange={(e) => setPriceMax(e.target.value)}
                className="w-full mt-1 p-2 rounded-md bg-slate-800/60 border border-slate-700/50"
                placeholder="9999"
              />
            </div>
            <div>
              <label className="text-sm text-slate-300">&nbsp;</label>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => {
                    setPage(1);
                  }}
                  className="cursor-pointer px-3 py-2 rounded bg-cyan-600 text-slate-900"
                >
                  Aplicar
                </button>
                <button
                  onClick={resetFilters}
                  className="cursor-pointer px-3 py-2 rounded bg-slate-700 text-slate-200"
                >
                  Limpiar
                </button>
              </div>
            </div>
            <div className="text-right text-sm text-slate-400">
              <div>
                Resultados: <strong>{meta.total}</strong>
              </div>
              <div>
                Página {meta.page} de {meta.pages}
              </div>
            </div>
          </div>
        </section>

        <section>
          {loading && <div className="text-center py-8">Cargando...</div>}
          {error && (
            <div className="text-center text-rose-400 py-8">{error}</div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((p) => (
                <div
                  key={p.id}
                  className="bg-black/40 p-4 rounded-lg border border-slate-700/40"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-cyan-100">
                      {p.name}
                    </h3>
                    <div className="text-sm text-slate-300">
                      {p.rarity?.name || "Común"}
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-3 line-clamp-3">
                    {p.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="text-cyan-200 font-semibold">
                      {p.price} ✦
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => addItem(p, 1)}
                        className="cursor-pointer px-3 py-1 rounded bg-cyan-600 text-slate-900"
                      >
                        Añadir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              disabled={meta.page <= 1}
              onClick={() => setPage((s) => Math.max(1, s - 1))}
              className="cursor-pointer px-3 py-2 rounded bg-slate-700 disabled:opacity-50"
            >
              Anterior
            </button>
            <div className="px-3 py-2 bg-slate-800 rounded">
              {meta.page} / {meta.pages || 1}
            </div>
            <button
              disabled={meta.page >= meta.pages}
              onClick={() => setPage((s) => s + 1)}
              className="px-3 py-2 rounded bg-slate-700 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
