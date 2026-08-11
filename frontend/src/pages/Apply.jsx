import { useState } from "react";
import { motion } from "framer-motion";
import { api } from "../lib/api";
import PageBanner from "../components/PageBanner";

const BANNER_IMAGE = "https://images.unsplash.com/photo-1613031729579-ace1feefda4c?fm=jpg&q=85&w=2000&auto=format&fit=crop";

const TYPES = [
  { id: "internship", label: "Internship" },
  { id: "advert", label: "Advertise with us" },
  { id: "partnership", label: "Partnership" },
  { id: "other", label: "Other" },
];

const initialForm = { type: "internship", name: "", email: "", phone: "", message: "" };

export default function Apply() {
  const [form, setForm] = useState(initialForm);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState("");

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      let attachment_url = "";
      if (file) {
        const { url } = await api.uploadApplicationAttachment(file);
        attachment_url = url;
      }
      await api.submitApplication({ ...form, attachment_url });
      setStatus("sent");
      setForm(initialForm);
      setFile(null);
    } catch (err) {
      setStatus("error");
      setError(err.message);
    }
  };

  const showAttachment = form.type === "internship" || form.type === "partnership";

  return (
    <div>
      <PageBanner
        image={BANNER_IMAGE}
        eyebrow="Work with us"
        title="Apply"
        subtitle="Looking to intern with us, advertise on air, or partner with the station? Tell us a bit about it below."
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">

      {status === "sent" ? (
        <div className="mt-10 rounded-2xl bg-mist/60 p-8 text-center shadow-lift">
          <p className="font-display text-2xl font-bold text-forest">Application received</p>
          <p className="mt-2 text-ink/70">Thank you for reaching out. We&rsquo;ll be in touch soon.</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-6 px-5 py-2.5 rounded-full bg-forest text-cream text-sm font-medium hover:bg-forest-light"
          >
            Submit another
          </button>
        </div>
      ) : (
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mt-10 space-y-5"
        >
          <div>
            <label className="block text-sm font-medium text-ink/80 mb-2">What&rsquo;s this about?</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setForm((f) => ({ ...f, type: t.id }))}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    form.type === t.id ? "bg-forest text-cream" : "bg-mist text-ink/70 hover:bg-mist/70"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="name">Name</label>
              <input id="name" required value={form.name} onChange={update("name")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="email">Email</label>
              <input id="email" type="email" required value={form.email} onChange={update("email")}
                className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="phone">Phone (optional)</label>
            <input id="phone" value={form.phone} onChange={update("phone")}
              className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/80 mb-1.5" htmlFor="message">
              {form.type === "internship" ? "Tell us about yourself" : "Message"}
            </label>
            <textarea id="message" required rows={5} value={form.message} onChange={update("message")}
              placeholder={
                form.type === "internship"
                  ? "What are you studying, what are you hoping to learn, and when are you available?"
                  : form.type === "advert"
                  ? "What are you advertising, and what timeslot or package are you interested in?"
                  : "Tell us more about what you have in mind."
              }
              className="w-full rounded-xl border border-forest/20 bg-white/70 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-forest/40" />
          </div>

          {showAttachment && (
            <div>
              <label className="block text-sm font-medium text-ink/80 mb-1.5">
                {form.type === "internship" ? "CV / résumé (optional)" : "Attachment (optional)"}
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="text-sm text-ink/70"
              />
              <p className="text-xs text-ink/50 mt-1">PDF, Word doc, or image, up to 8MB.</p>
            </div>
          )}

          {status === "error" && <p className="text-clay text-sm">{error}</p>}

          <button
            type="submit"
            disabled={status === "sending"}
            className="px-6 py-3 rounded-full bg-forest text-cream text-sm font-medium hover:bg-forest-light disabled:opacity-50"
          >
            {status === "sending" ? "Submitting…" : "Submit application"}
          </button>
        </motion.form>
      )}
      </div>
    </div>
  );
}
