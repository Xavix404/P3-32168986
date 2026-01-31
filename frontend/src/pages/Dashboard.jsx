import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-slate-900 via-indigo-900 to-sky-800 p-6">
      <div className="w-full max-w-3xl bg-black/40 backdrop-blur-md border border-indigo-500/20 rounded-2xl shadow-lg p-8">
        <h2 className="text-cyan-100 text-2xl font-semibold mb-4">
          Bienvenido Usuario
        </h2>
        <p className="text-slate-300 mb-6">
          {user?.username ? `${user.username}` : ""}.
        </p>
        <div className="space-x-3">
          <a
            href="/products"
            className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 cursor-pointer"
          >
            Comprar
          </a>
          <button
            onClick={logout}
            className="px-4 py-2 rounded-lg bg-rose-500 text-white hover:bg-rose-400 cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
