"use client";

import { useState, useEffect } from "react";
import { Star, Send } from "lucide-react";

interface Review {
  id: string;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then((r) => r.json())
      .then(setReviews)
      .catch(() => {});
  }, [productId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, comment }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews((prev) => [data.review, ...prev]);
        setName("");
        setComment("");
        setRating(5);
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 3000);
      }
    } catch {}
    setSubmitting(false);
  }

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#1B3A5C]">
          Reviews {reviews.length > 0 && <span className="text-brand-cyan">({reviews.length})</span>}
        </h2>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={`w-4 h-4 ${i <= Math.round(Number(avgRating)) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
              ))}
            </div>
            <span className="text-sm font-bold text-[#1B3A5C]">{avgRating}</span>
          </div>
        )}
      </div>

      {/* Write review */}
      <form onSubmit={handleSubmit} className="p-5 rounded-2xl border border-[#e8edf2] bg-white mb-6">
        <p className="text-sm font-bold text-[#1B3A5C] mb-3">Write a Review</p>
        <div className="flex gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <button
              key={i}
              type="button"
              onClick={() => setRating(i)}
              onMouseEnter={() => setHoverRating(i)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <Star className={`w-6 h-6 transition-colors ${i <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
            </button>
          ))}
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
          className="w-full px-3 py-2 border border-[#e8edf2] rounded-lg text-sm text-gray-900 mb-2 focus:outline-none focus:border-brand-cyan/50"
        />
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience (optional)"
          rows={3}
          className="w-full px-3 py-2 border border-[#e8edf2] rounded-lg text-sm text-gray-900 mb-3 focus:outline-none focus:border-brand-cyan/50 resize-none"
        />
        <button
          type="submit"
          disabled={submitting || !name.trim()}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-brand-cyan text-white text-sm font-semibold hover:bg-brand-cyan/90 transition-colors disabled:opacity-50"
        >
          <Send className="w-3.5 h-3.5" /> {submitting ? "Submitting..." : "Submit Review"}
        </button>
        {submitted && <p className="text-green-600 text-xs mt-2 font-medium">Thanks for your review!</p>}
      </form>

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-[#8a9bab] text-sm text-center py-8">No reviews yet. Be the first!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="p-4 rounded-xl border border-[#e8edf2] bg-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand-cyan/10 flex items-center justify-center text-brand-cyan text-xs font-bold">
                    {review.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-[#1B3A5C]">{review.name}</span>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                  ))}
                </div>
              </div>
              {review.comment && <p className="text-sm text-[#5a6f80] leading-relaxed">{review.comment}</p>}
              <p className="text-[10px] text-[#8a9bab] mt-2">{new Date(review.date).toLocaleDateString("en-AE", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
