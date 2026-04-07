import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Globe, FileText, Key } from "lucide-react";
import { maskToken } from "@/lib/utils";
import ClientActions from "@/components/ClientActions";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { posts: true },
      },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Clients
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Manage your client websites
          </p>
        </div>
        <Link
          href="/dashboard/clients/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
          style={{
            background: "linear-gradient(135deg, #6366f1, #818cf8)",
            boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
          }}
        >
          <Plus className="w-4 h-4" />
          Add Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
          }}
        >
          <Globe
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--text-muted)" }}
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No clients yet
          </h3>
          <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
            Add your first client to start managing their blog content.
          </p>
          <Link
            href="/dashboard/clients/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{
              background: "linear-gradient(135deg, #6366f1, #818cf8)",
            }}
          >
            <Plus className="w-4 h-4" />
            Add Your First Client
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="rounded-2xl p-5 transition-all duration-200 group"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {client.name}
                  </h3>
                  {client.domain && (
                    <p
                      className="text-sm flex items-center gap-1 mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Globe className="w-3 h-3" />
                      {client.domain}
                    </p>
                  )}
                </div>
                <ClientActions clientId={client.id} clientName={client.name} />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <FileText
                    className="w-4 h-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span
                    className="text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {client._count.posts} post
                    {client._count.posts !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Key
                    className="w-4 h-4"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <span
                    className="text-xs font-mono"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {maskToken(client.apiToken)}
                  </span>
                </div>
              </div>

              <div
                className="mt-4 pt-4 flex items-center gap-2"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <Link
                  href={`/dashboard/clients/${client.id}/posts`}
                  className="flex-1 text-center py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: "var(--accent-glow)",
                    color: "var(--accent-hover)",
                    border: "1px solid rgba(99, 102, 241, 0.2)",
                  }}
                >
                  View Posts
                </Link>
                <Link
                  href={`/dashboard/clients/${client.id}/edit`}
                  className="py-2 px-4 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    backgroundColor: "var(--bg-surface-hover)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                >
                  Edit
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
