"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { slugify } from "@/lib/utils";
import type { ActionResult } from "@/types";

export async function createPost(
  clientId: string,
  data: { title: string; content: string; imageUrl?: string; status?: "DRAFT" | "PUBLISHED" }
): Promise<ActionResult> {
  try {
    let slug = slugify(data.title);

    // Ensure unique slug for this client
    const existing = await prisma.post.findFirst({
      where: { clientId, slug },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    await prisma.post.create({
      data: {
        title: data.title,
        slug,
        content: data.content,
        imageUrl: data.imageUrl || null,
        status: data.status || "DRAFT",
        clientId,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}/posts`);
    return { success: true, message: "Post created successfully" };
  } catch (error) {
    console.error("Failed to create post:", error);
    return { success: false, message: "Failed to create post" };
  }
}

export async function updatePost(
  postId: string,
  clientId: string,
  data: { title: string; content: string; imageUrl?: string; status?: "DRAFT" | "PUBLISHED" }
): Promise<ActionResult> {
  try {
    let slug = slugify(data.title);

    const existing = await prisma.post.findFirst({
      where: { clientId, slug, NOT: { id: postId } },
    });
    if (existing) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    await prisma.post.update({
      where: { id: postId },
      data: {
        title: data.title,
        slug,
        content: data.content,
        imageUrl: data.imageUrl || null,
        status: data.status,
      },
    });

    revalidatePath(`/dashboard/clients/${clientId}/posts`);
    return { success: true, message: "Post updated successfully" };
  } catch (error) {
    console.error("Failed to update post:", error);
    return { success: false, message: "Failed to update post" };
  }
}

export async function deletePost(
  postId: string,
  clientId: string
): Promise<ActionResult> {
  try {
    await prisma.post.delete({
      where: { id: postId },
    });
    revalidatePath(`/dashboard/clients/${clientId}/posts`);
    return { success: true, message: "Post deleted successfully" };
  } catch (error) {
    console.error("Failed to delete post:", error);
    return { success: false, message: "Failed to delete post" };
  }
}

export async function publishPost(
  postId: string,
  clientId: string
): Promise<ActionResult> {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { status: "PUBLISHED" },
    });
    revalidatePath(`/dashboard/clients/${clientId}/posts`);
    return { success: true, message: "Post published!" };
  } catch (error) {
    console.error("Failed to publish post:", error);
    return { success: false, message: "Failed to publish post" };
  }
}

export async function unpublishPost(
  postId: string,
  clientId: string
): Promise<ActionResult> {
  try {
    await prisma.post.update({
      where: { id: postId },
      data: { status: "DRAFT" },
    });
    revalidatePath(`/dashboard/clients/${clientId}/posts`);
    return { success: true, message: "Post unpublished" };
  } catch (error) {
    console.error("Failed to unpublish post:", error);
    return { success: false, message: "Failed to unpublish post" };
  }
}
