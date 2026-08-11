import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import PageBanner from "../components/PageBanner";

const BANNER_IMAGE = "https://images.unsplash.com/photo-1485579149621-3123dd979885?fm=jpg&q=85&w=2000&auto=format&fit=crop";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function Contact({ station }) {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.contact(form);
      setStatus("sent");
      setForm(initialForm);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  return (
    <div>
      <PageBanner
        image={BANNER_IMAGE}
        eyebrow="Get in touch"
        title="Contact us"
        subtitle="Song requests, prayer requests, feedback, or partnership enquiries. We'd love to hear from you."
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {status === "sent" ? (
          <div className="mt-2 rounded-2xl bg-mist/60 p-8 text-center shadow-lift">
            <p className="font-display text-2xl font-bold text-forest">Message received</p>
            <p className="mt-2 text-ink/70">Thank you for reaching out. We&rsquo;ll get back to you soon.</p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-medium hover:bg-forest-light"
            >
              Send another message
            </button>
          </div>
        ) : (
          <motion.form
            onSubmit={submit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mt-2 grid sm:grid-cols-2 gap-5"
          >
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="name">Name</label>
              <input id="name" required value={form.name} onChange={update("name")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={update("email")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="phone">Phone (optional)</label>
              <input id="phone" value={form.phone} onChange={update("phone")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="subject">Subject</label>
              <input id="subject" value={form.subject} onChange={update("subject")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="message">Message</label>
              <textarea id="message" required rows={5} value={form.message} onChange={update("message")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>

            {status === "error" && <p className="sm:col-span-2 text-clay text-sm">{error}</p>}

            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={status === "sending"}
                className="px-6 py-3 rounded-full bg-forest text-cream text-sm font-medium hover:bg-forest-light disabled:opacity-50"
              >
                {status === "sending" ? "Sending…" : "Send message"}
              </button>
            </div>
          </motion.form>
        )}

        <div className="mt-16 border-t border-forest/10 pt-8 text-sm text-ink/60">
          <p>{station?.name} &middot; {station?.frequency}</p>
          <p>{station?.city}</p>
        </div>
      </div>
    </div>
  );
}
