"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { ActionResult } from "@/types";

const clientSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  domain: z.string().max(200).optional(),
});

export async function createClient(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    domain: formData.get("domain") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.client.create({
      data: {
        name: parsed.data.name,
        domain: parsed.data.domain || null,
      },
    });
  } catch (error) {
    console.error("Failed to create client:", error);
    return { success: false, message: "Failed to create client" };
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function updateClient(
  clientId: string,
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const parsed = clientSchema.safeParse({
    name: formData.get("name"),
    domain: formData.get("domain") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Validation failed",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await prisma.client.update({
      where: { id: clientId },
      data: {
        name: parsed.data.name,
        domain: parsed.data.domain || null,
      },
    });
  } catch (error) {
    console.error("Failed to update client:", error);
    return { success: false, message: "Failed to update client" };
  }

  revalidatePath("/dashboard/clients");
  redirect("/dashboard/clients");
}

export async function deleteClient(clientId: string): Promise<ActionResult> {
  try {
    await prisma.client.delete({
      where: { id: clientId },
    });
    revalidatePath("/dashboard/clients");
    return { success: true, message: "Client deleted successfully" };
  } catch (error) {
    console.error("Failed to delete client:", error);
    return { success: false, message: "Failed to delete client" };
  }
}

export async function regenerateApiToken(
  clientId: string
): Promise<ActionResult> {
  try {
    const crypto = await import("crypto");
    await prisma.client.update({
      where: { id: clientId },
      data: { apiToken: crypto.randomUUID() },
    });
    revalidatePath("/dashboard/clients");
    return { success: true, message: "API token regenerated" };
  } catch (error) {
    console.error("Failed to regenerate token:", error);
    return { success: false, message: "Failed to regenerate token" };
  }
}
