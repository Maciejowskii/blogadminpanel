import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Sparkles, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PostActions from "@/components/PostActions";

export const dynamic = "force-dynamic";

export default async function ClientPostsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      posts: {
        orderBy: { updatedAt: "desc" },
      },
    },
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
        <div className="flex items-center justify-between">
          <div>
            <h1
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {client.name} — Posts
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--text-secondary)" }}
            >
              {client.posts.length} post
              {client.posts.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/clients/${id}/posts/new?ai=true`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #a855f7, #6366f1)",
                color: "white",
                boxShadow: "0 4px 14px rgba(168, 85, 247, 0.25)",
              }}
            >
              <Sparkles className="w-4 h-4" />
              Generate with AI
            </Link>
            <Link
              href={`/dashboard/clients/${id}/posts/new`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #6366f1, #818cf8)",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.25)",
              }}
            >
              <Plus className="w-4 h-4" />
              New Post
            </Link>
          </div>
        </div>
      </div>

      {client.posts.length === 0 ? (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            backgroundColor: "var(--bg-surface)",
            border: "1px solid var(--border)",
          }}
        >
          <FileText
            className="w-12 h-12 mx-auto mb-4"
            style={{ color: "var(--text-muted)" }}
          />
          <h3
            className="text-lg font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            No posts yet
          </h3>
          <p
            className="text-sm mb-6"
            style={{ color: "var(--text-muted)" }}
          >
            Write your first post manually or generate one with AI.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {client.posts.map((post) => (
            <div
              key={post.id}
              className="rounded-2xl p-5 flex items-center justify-between transition-all duration-200"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <Link
                    href={`/dashboard/clients/${id}/posts/${post.id}/edit`}
                    className="font-semibold text-sm truncate transition-colors duration-200"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {post.title}
                  </Link>
                  <span
                    className="text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0"
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
                <p
                  className="text-xs"
                  style={{ color: "var(--text-muted)" }}
                >
                  slug: /{post.slug} · Updated {formatDate(post.updatedAt)}
                </p>
              </div>
              <PostActions
                postId={post.id}
                clientId={id}
                status={post.status}
                title={post.title}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
