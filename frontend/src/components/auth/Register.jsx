import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const payload = { username, email, password };
      const res = await fetch("api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok || json.status === "fail") {
        const msg =
          json.message ||
          (json.data && json.data[0]?.msg) ||
          "Registro fallido";
        setError(msg);
        return;
      }
      // registro ok -> ir a login
      navigate("/login");
    } catch (err) {
      setLoading(false);
      setError("Error de red");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-900 via-indigo-900 to-sky-800 p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <svg
            className="w-20 h-20 text-cyan-300"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="rgba(8,30,50,0.15)"
            />
            <g
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 22 L32 34 L48 22" />
              <path d="M16 42 L32 30 L48 42" />
              <path d="M32 14 L32 20" strokeWidth="1.6" />
              <path d="M32 50 L32 44" strokeWidth="1.6" />
            </g>
          </svg>
          <h1 className="mt-3 text-center text-2xl font-semibold text-cyan-100 tracking-widest">
            Gremio de mercaderes
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            Regístrate y empieza tu travesía
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Usuario
              </label>
              <div className="flex items-center bg-slate-800/60 rounded-full px-3 py-2 border border-slate-700/60">
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-400"
                  placeholder="Nombre de usuario"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Correo
              </label>
              <div className="flex items-center bg-slate-800/60 rounded-full px-3 py-2 border border-slate-700/60">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-400"
                  placeholder="tú@correo.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Contraseña
              </label>
              <div className="flex items-center bg-slate-800/60 rounded-full px-3 py-2 border border-slate-700/60">
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-400"
                  placeholder="Mínimo 6 caracteres"
                />
              </div>
            </div>

            {error && <div className="text-sm text-rose-400">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-3 bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md text-slate-900 font-semibold disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-4">
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className="text-cyan-300 hover:underline">
              Inicia sesión
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
