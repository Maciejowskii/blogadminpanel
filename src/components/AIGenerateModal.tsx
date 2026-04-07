"use client";

import { useState } from "react";
import { Sparkles, Loader2, X, Wand2 } from "lucide-react";

interface AIGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onGenerated: (data: {
    title: string;
    content: string;
    imageUrl: string | null;
  }) => void;
}

export default function AIGenerateModal({
  open,
  onClose,
  onGenerated,
}: AIGenerateModalProps) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim() }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to generate");
      }

      const data = await response.json();
      onGenerated({
        title: data.title,
        content: data.content,
        imageUrl: data.imageUrl,
      });
      setTopic("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate. Check API keys."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative rounded-2xl p-6 max-w-md w-full"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="p-2.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #a855f7, #6366f1)",
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3
              className="font-semibold text-lg"
              style={{ color: "var(--text-primary)" }}
            >
              AI Blog Generator
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Powered by GPT-4o & Pexels
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <div>
            <label
              htmlFor="ai-topic"
              className="block text-sm font-medium mb-2"
              style={{ color: "var(--text-secondary)" }}
            >
              What should the blog post be about?
            </label>
            <textarea
              id="ai-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              rows={3}
              disabled={loading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none transition-all duration-200 focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
              }}
              placeholder="e.g. 10 tips for better SEO in 2024, The future of AI in marketing, How to start a blog..."
            />
          </div>

          {error && (
            <p className="text-sm" style={{ color: "var(--danger)" }}>
              {error}
            </p>
          )}

          {loading && (
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                backgroundColor: "var(--accent-glow)",
                border: "1px solid rgba(99, 102, 241, 0.2)",
              }}
            >
              <div className="spinner" />
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--accent-hover)" }}
                >
                  Generating your blog post...
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  This may take 15-30 seconds
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
            style={{
              background: loading
                ? "var(--accent)"
                : "linear-gradient(135deg, #a855f7, #6366f1)",
              boxShadow: "0 4px 14px rgba(168, 85, 247, 0.25)",
            }}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4" />
            )}
            {loading ? "Generating..." : "Generate Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
