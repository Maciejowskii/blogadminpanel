"use client";

import { useActionState } from "react";
import { createClient, updateClient } from "@/app/actions/clients";
import { Loader2 } from "lucide-react";
import type { ActionResult } from "@/types";

interface ClientFormProps {
  client?: {
    id: string;
    name: string;
    domain: string | null;
  };
}

export default function ClientForm({ client }: ClientFormProps) {
  const isEditing = !!client;

  const action = isEditing
    ? updateClient.bind(null, client.id)
    : createClient;

  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    action,
    null
  );

  return (
    <form action={formAction} className="space-y-6 max-w-lg">
      {state && !state.success && (
        <div
          className="p-3 rounded-xl text-sm"
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "#fca5a5",
          }}
        >
          {state.message}
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Client Name <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={client?.name || ""}
          required
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          placeholder="e.g. Acme Corp"
        />
        {state?.errors?.name && (
          <p className="mt-1 text-xs" style={{ color: "var(--danger)" }}>
            {state.errors.name[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="domain"
          className="block text-sm font-medium mb-2"
          style={{ color: "var(--text-secondary)" }}
        >
          Domain
        </label>
        <input
          id="domain"
          name="domain"
          type="text"
          defaultValue={client?.domain || ""}
          className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2"
          style={{
            backgroundColor: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-primary)",
          }}
          placeholder="e.g. acme.com"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 disabled:opacity-50 cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #6366f1, #818cf8)",
          boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
        }}
      >
        {pending && <Loader2 className="w-4 h-4 animate-spin" />}
        {isEditing ? "Update Client" : "Create Client"}
      </button>
    </form>
  );
}
