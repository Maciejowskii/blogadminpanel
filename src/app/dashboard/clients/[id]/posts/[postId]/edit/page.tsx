import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditorPageClient from "@/components/PostEditorPageClient";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string; postId: string }>;
}) {
  const { id, postId } = await params;

  const client = await prisma.client.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!client) {
    notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id: postId },
  });

  if (!post || post.clientId !== id) {
    notFound();
  }

  return (
    <PostEditorPageClient
      clientId={client.id}
      clientName={client.name}
      post={{
        id: post.id,
        title: post.title,
        content: post.content,
        imageUrl: post.imageUrl,
        status: post.status,
      }}
    />
  );
}
