import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PostEditorPageClient from "@/components/PostEditorPageClient";

export const dynamic = "force-dynamic";

export default async function NewPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const search = await searchParams;

  const client = await prisma.client.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  if (!client) {
    notFound();
  }

  return (
    <PostEditorPageClient
      clientId={client.id}
      clientName={client.name}
      showAiOnMount={search.ai === "true"}
    />
  );
}
