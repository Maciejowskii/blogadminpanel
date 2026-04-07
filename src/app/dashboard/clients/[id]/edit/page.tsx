import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ClientForm from "@/components/ClientForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
  });

  if (!client) {
    notFound();
  }

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
          Edit Client
        </h1>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--text-secondary)" }}
        >
          Update details for {client.name}
        </p>
      </div>

      <div
        className="rounded-2xl p-6"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        <ClientForm
          client={{
            id: client.id,
            name: client.name,
            domain: client.domain,
          }}
        />
      </div>
    </div>
  );
}
