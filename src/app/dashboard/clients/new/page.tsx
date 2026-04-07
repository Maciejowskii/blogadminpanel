import ClientForm from "@/components/ClientForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewClientPage() {
  return (
    <div>
      <div className="mb-8">
        <Link
          href="/dashboard/clients"
          className="inline-flex items-center gap-1 text-sm mb-4 transition-colors duration-200"
          style={{ color: "var(--text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Clients
        </Link>
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Add New Client
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Create a new client to manage their blog content
        </p>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        <ClientForm />
      </div>
    </div>
  );
}
