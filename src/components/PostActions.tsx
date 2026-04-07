"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  deletePost,
  publishPost,
  unpublishPost,
} from "@/app/actions/posts";
import ConfirmDialog from "@/components/ConfirmDialog";

interface PostActionsProps {
  postId: string;
  clientId: string;
  status: string;
  title: string;
}

export default function PostActions({
  postId,
  clientId,
  status,
  title,
}: PostActionsProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    await deletePost(postId, clientId);
    setConfirmDelete(false);
    router.refresh();
  };

  const handleTogglePublish = async () => {
    if (status === "PUBLISHED") {
      await unpublishPost(postId, clientId);
    } else {
      await publishPost(postId, clientId);
    }
    setMenuOpen(false);
    router.refresh();
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1.5 rounded-lg transition-colors duration-200 cursor-pointer"
          style={{ color: "var(--text-muted)" }}
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="absolute right-0 top-8 z-20 w-48 rounded-xl py-1 shadow-xl"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <button
                onClick={() => {
                  setMenuOpen(false);
                  router.push(
                    `/dashboard/clients/${clientId}/posts/${postId}/edit`
                  );
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                style={{ color: "var(--text-secondary)" }}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleTogglePublish}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                style={{
                  color:
                    status === "PUBLISHED"
                      ? "var(--warning)"
                      : "var(--success)",
                }}
              >
                {status === "PUBLISHED" ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Publish
                  </>
                )}
              </button>
              <div
                className="my-1"
                style={{ borderTop: "1px solid var(--border)" }}
              />
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmDelete(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer"
                style={{ color: "var(--danger)" }}
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Post"
        message={`Are you sure you want to delete "${title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </>
  );
}
