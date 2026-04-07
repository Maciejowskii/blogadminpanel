"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Save, Eye, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import Editor from "@/components/Editor";
import AIGenerateModal from "@/components/AIGenerateModal";
import { createPost, updatePost } from "@/app/actions/posts";
import { ToastProvider, useToast } from "@/components/Toast";

interface PostEditorPageClientProps {
  clientId: string;
  clientName: string;
  post?: {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    status: string;
  };
  showAiOnMount?: boolean;
}

function PostEditorInner({
  clientId,
  clientName,
  post,
  showAiOnMount,
}: PostEditorPageClientProps) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEditing = !!post;

  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [imageUrl, setImageUrl] = useState(post?.imageUrl || "");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [showAI, setShowAI] = useState(showAiOnMount || false);

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!title.trim()) {
      addToast("error", "Title is required");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      addToast("error", "Content is required");
      return;
    }

    const setLoader = status === "PUBLISHED" ? setPublishing : setSaving;
    setLoader(true);

    try {
      const data = { title, content, imageUrl: imageUrl || undefined, status };
      const result = isEditing
        ? await updatePost(post.id, clientId, data)
        : await createPost(clientId, data);

      if (result.success) {
        addToast("success", result.message);
        router.push(`/dashboard/clients/${clientId}/posts`);
        router.refresh();
      } else {
        addToast("error", result.message);
      }
    } catch {
      addToast("error", "Something went wrong");
    } finally {
      setLoader(false);
    }
  };

  const handleAIGenerated = (data: {
    title: string;
    content: string;
    imageUrl: string | null;
  }) => {
    setTitle(data.title);
    setContent(data.content);
    if (data.imageUrl) setImageUrl(data.imageUrl);
    setShowAI(false);
    addToast("success", "AI content loaded into editor. Review and save!");
  };

  return (
    <div>
      <div className="mb-6">
        <Link
          href={`/dashboard/clients/${clientId}/posts`}
          className="inline-flex items-center gap-1 text-sm mb-4 transition-colors duration-200"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {clientName} Posts
        </Link>
        <div className="flex items-center justify-between">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            {isEditing ? "Edit Post" : "New Post"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAI(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #a855f7, #6366f1)",
                color: "white",
              }}
            >
              <Sparkles className="w-4 h-4" />
              AI Generate
            </button>
            <button
              onClick={() => handleSave("DRAFT")}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: "var(--bg-surface-hover)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border)",
              }}
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Save Draft
            </button>
            <button
              onClick={() => handleSave("PUBLISHED")}
              disabled={publishing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white cursor-pointer transition-all duration-200 disabled:opacity-50"
              style={{
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0 4px 14px rgba(34, 197, 94, 0.25)",
              }}
            >
              {publishing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="post-title"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Title
          </label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-lg font-semibold outline-none transition-all duration-200 focus:ring-2"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="Post title..."
          />
        </div>

        {/* Cover Image URL */}
        <div>
          <label
            htmlFor="cover-image"
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Cover Image URL
          </label>
          <input
            id="cover-image"
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            placeholder="https://images.pexels.com/..."
          />
          {imageUrl && (
            <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <img
                src={imageUrl}
                alt="Cover"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
        </div>

        {/* Editor */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Content
          </label>
          <Editor
            key={content ? "loaded" : "empty"}
            content={content}
            onChange={setContent}
          />
        </div>
      </div>

      <AIGenerateModal
        open={showAI}
        onClose={() => setShowAI(false)}
        onGenerated={handleAIGenerated}
      />
    </div>
  );
}

export default function PostEditorPageClient(
  props: PostEditorPageClientProps
) {
  return (
    <ToastProvider>
      <PostEditorInner {...props} />
    </ToastProvider>
  );
}
