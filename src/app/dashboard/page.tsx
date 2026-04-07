import { prisma } from "@/lib/prisma";
import { Users, FileText, Eye, FilePen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clientCount, postCount, publishedCount, draftCount] =
    await Promise.all([
      prisma.client.count(),
      prisma.post.count(),
      prisma.post.count({ where: { status: "PUBLISHED" } }),
      prisma.post.count({ where: { status: "DRAFT" } }),
    ]);

  const recentPosts = await prisma.post.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: { client: { select: { name: true } } },
  });

  const stats = [
    {
      label: "Total Clients",
      value: clientCount,
      icon: Users,
      color: "#6366f1",
      bg: "rgba(99, 102, 241, 0.1)",
    },
    {
      label: "Total Posts",
      value: postCount,
      icon: FileText,
      color: "#818cf8",
      bg: "rgba(129, 140, 248, 0.1)",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: Eye,
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.1)",
    },
    {
      label: "Drafts",
      value: draftCount,
      icon: FilePen,
      color: "#f59e0b",
      bg: "rgba(245, 158, 11, 0.1)",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1
          className="text-2xl font-bold tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Dashboard
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Overview of your content management system
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl p-5 transition-all duration-200"
            style={{
              backgroundColor: "var(--bg-surface)",
              border: "1px solid var(--border)",
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div
                className="p-2.5 rounded-xl"
                style={{ backgroundColor: stat.bg }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p
              className="text-3xl font-bold"
              style={{ color: "var(--text-primary)" }}
            >
              {stat.value}
            </p>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Posts */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--bg-surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="px-6 py-4 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <h2
            className="font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Recent Posts
          </h2>
          <Link
            href="/dashboard/clients"
            className="text-sm font-medium transition-colors duration-200"
            style={{ color: "var(--accent)" }}
          >
            View all clients →
          </Link>
        </div>

        {recentPosts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <FileText
              className="w-10 h-10 mx-auto mb-3"
              style={{ color: "var(--text-muted)" }}
            />
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              No posts yet. Create your first client and start writing!
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="px-6 py-4 flex items-center justify-between"
              >
                <div>
                  <p
                    className="font-medium text-sm"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </p>
                  <p
                    className="text-xs mt-0.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {post.client.name} ·{" "}
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full"
                  style={{
                    backgroundColor:
                      post.status === "PUBLISHED"
                        ? "rgba(34, 197, 94, 0.1)"
                        : "rgba(245, 158, 11, 0.1)",
                    color:
                      post.status === "PUBLISHED" ? "#22c55e" : "#f59e0b",
                    border: `1px solid ${
                      post.status === "PUBLISHED"
                        ? "rgba(34, 197, 94, 0.2)"
                        : "rgba(245, 158, 11, 0.2)"
                    }`,
                  }}
                >
                  {post.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
