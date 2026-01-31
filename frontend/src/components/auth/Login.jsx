import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { username, password }; // backend espera username
      const res = await fetch("api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // <- importante para recibir cookie httpOnly
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        // mostrar error al usuario
        alert(data.message || "Credenciales inválidas");
        return;
      }
      // Actualizar contexto de autenticación y redirigir
      authContext.login(data.token, username);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error de red");
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
              transform="translate(0,0)"
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
            Accede a tu cuenta para poder comerciar
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Username
              </label>
              <div className="flex items-center bg-slate-800/60 rounded-full px-3 py-2 border border-slate-700/60 focus-within:ring-2 focus-within:ring-cyan-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="icon icon-tabler icons-tabler-filled icon-tabler-user text-cyan-300"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                  <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
                </svg>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-400"
                  placeholder="Finn"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-200 mb-2">
                Contraseña
              </label>
              <div className="flex items-center bg-slate-800/60 rounded-full px-3 py-2 border border-slate-700/60 focus-within:ring-2 focus-within:ring-cyan-400">
                <svg
                  className="w-5 h-5 text-cyan-300 mr-2"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="10"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M7 11V8a5 5 0 0110 0v3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-slate-100 placeholder-slate-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-cyan-400"
                />
                <span>Recordarme</span>
              </label>
              <a href="#" className="text-cyan-300 hover:underline">
                Olvidé mi clave
              </a>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-3 rounded-2xl px-5 py-3 bg-linear-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 shadow-md text-slate-900 font-semibold"
            >
              Entrar
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-slate-700/40" />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          ¿No tienes cuenta?{" "}
          <a href="/register" className="text-cyan-300 hover:underline">
            Únete al gremio
          </a>
        </p>
      </div>
    </div>
  );
}
