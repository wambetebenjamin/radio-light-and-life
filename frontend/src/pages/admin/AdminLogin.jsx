import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../lib/api";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await api.login(username, password);
      api.saveToken(token);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm bg-white/70 rounded-2xl border border-forest/10 p-8 shadow-lift">
        <p className="font-mono text-xs uppercase tracking-widest text-clay">Station admin</p>
        <h1 className="font-display text-2xl font-bold text-forest mt-1">Sign in</h1>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="username">Username</label>
            <input id="username" required value={username} onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="password">Password</label>
            <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-forest/20 bg-white px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-clay">{error}</p>}

        <button type="submit" disabled={loading}
          className="mt-6 w-full px-5 py-3 rounded-full bg-forest text-cream text-sm font-semibold hover:bg-forest-light transition-colors disabled:opacity-50">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
