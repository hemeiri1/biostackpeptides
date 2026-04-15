"use client";

import { useState } from "react";
import { Mail, MessageSquare, Send, CheckCircle, Phone } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {}
    setSubmitted(true);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center mb-16">
        <p className="text-brand-cyan text-sm font-medium mb-3">Get in Touch</p>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
        <p className="text-brand-muted max-w-lg mx-auto">
          Questions about products, protocols, or your order? We&apos;re here to help.
          Expect a response within 24 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Contact info */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
            <Mail className="w-6 h-6 text-brand-cyan mb-3" />
            <h3 className="text-gray-900 font-semibold mb-1">Email</h3>
            <p className="text-brand-muted text-sm">Contact@biostackpeptide.com</p>
            <p className="text-brand-muted text-xs mt-1">Response within 24 hours</p>
          </div>
          <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
            <Phone className="w-6 h-6 text-brand-cyan mb-3" />
            <h3 className="text-gray-900 font-semibold mb-1">Phone / WhatsApp</h3>
            <a href="tel:+18723661398" className="text-brand-muted text-sm hover:text-brand-cyan transition-colors">+1 (872) 366-1398</a>
            <p className="text-brand-muted text-xs mt-1">Available Mon–Sat, 9AM–6PM</p>
          </div>
          <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
            <MessageSquare className="w-6 h-6 text-brand-cyan mb-3" />
            <h3 className="text-gray-900 font-semibold mb-1">Research Support</h3>
            <p className="text-brand-muted text-sm">
              Protocol guidance, reconstitution help, product selection — our team is ready.
            </p>
          </div>
          <div className="p-6 rounded-xl border border-brand-border bg-brand-card">
            <div className="text-2xl mb-3">📦</div>
            <h3 className="text-gray-900 font-semibold mb-1">Order Support</h3>
            <p className="text-brand-muted text-sm">
              Include your order number in your message for fastest resolution.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 rounded-xl border border-green-500/20 bg-green-500/5">
              <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h2>
              <p className="text-brand-muted">
                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="p-8 rounded-xl border border-brand-border bg-brand-card space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Subject
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-gray-900 text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors"
                >
                  <option value="">Select a subject</option>
                  <option value="product">Product Inquiry</option>
                  <option value="order">Order Support</option>
                  <option value="research">Research Protocol Help</option>
                  <option value="wholesale">Wholesale / Bulk Order</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 bg-brand-dark border border-brand-border rounded-lg text-gray-900 placeholder-brand-muted text-sm focus:outline-none focus:border-brand-cyan/50 transition-colors resize-none"
                  placeholder="Describe your question or request in detail..."
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-cyan text-brand-darker font-semibold hover:bg-brand-cyan/90 transition-colors"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>

              <p className="text-center text-brand-muted text-xs">
                By submitting, you confirm all products are for research purposes only.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
