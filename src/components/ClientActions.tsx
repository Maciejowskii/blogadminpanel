"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MoreVertical, Pencil, Trash2, RefreshCw, Copy } from "lucide-react";
import { deleteClient, regenerateApiToken } from "@/app/actions/clients";
import ConfirmDialog from "@/components/ConfirmDialog";

interface ClientActionsProps {
  clientId: string;
  clientName: string;
}

export default function ClientActions({
  clientId,
  clientName,
}: ClientActionsProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmRegen, setConfirmRegen] = useState(false);

  const handleDelete = async () => {
    await deleteClient(clientId);
    setConfirmDelete(false);
    router.refresh();
  };

  const handleRegenerate = async () => {
    await regenerateApiToken(clientId);
    setConfirmRegen(false);
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
                  router.push(`/dashboard/clients/${clientId}/edit`);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmRegen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate Token
              </button>
              <button
                onClick={async () => {
                  setMenuOpen(false);
                  try {
                    const res = await fetch(`/api/client-token/${clientId}`);
                    const data = await res.json();
                    await navigator.clipboard.writeText(data.token);
                  } catch {
                    // silently fail
                  }
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm cursor-pointer transition-colors"
                style={{ color: "var(--text-secondary)" }}
              >
                <Copy className="w-4 h-4" />
                Copy Token
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
        title="Delete Client"
        message={`Are you sure you want to delete "${clientName}"? All posts for this client will also be deleted. This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />

      <ConfirmDialog
        open={confirmRegen}
        title="Regenerate API Token"
        message={`This will invalidate the current API token for "${clientName}". Client websites using the old token will stop working.`}
        confirmLabel="Regenerate"
        onConfirm={handleRegenerate}
        onCancel={() => setConfirmRegen(false)}
      />
    </>
  );
}
