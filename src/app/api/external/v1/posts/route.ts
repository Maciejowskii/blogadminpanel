import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    // Authenticate via Bearer token or query param
    const authHeader = request.headers.get("authorization");
    const tokenFromQuery = request.nextUrl.searchParams.get("token");

    let apiToken: string | null = null;

    if (authHeader?.startsWith("Bearer ")) {
      apiToken = authHeader.slice(7);
    } else if (tokenFromQuery) {
      apiToken = tokenFromQuery;
    }

    if (!apiToken) {
      return NextResponse.json(
        { error: "Missing API token. Use Authorization: Bearer <token> header or ?token=<token> query param." },
        { status: 401 }
      );
    }

    // Find client by token
    const client = await prisma.client.findUnique({
      where: { apiToken },
    });

    if (!client) {
      return NextResponse.json(
        { error: "Invalid API token" },
        { status: 401 }
      );
    }

    // Parse query params
    const page = Math.max(1, parseInt(request.nextUrl.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(request.nextUrl.searchParams.get("limit") || "10")));
    const slug = request.nextUrl.searchParams.get("slug");

    // If slug is provided, return single post
    if (slug) {
      const post = await prisma.post.findFirst({
        where: {
          clientId: client.id,
          slug,
          status: "PUBLISHED",
        },
        select: {
          id: true,
          title: true,
          slug: true,
          content: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!post) {
        return NextResponse.json(
          { error: "Post not found" },
          { status: 404 }
        );
      }

      return NextResponse.json({ data: post }, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Get paginated list of published posts
    const total = await prisma.post.count({
      where: {
        clientId: client.id,
        status: "PUBLISHED",
      },
    });

    const posts = await prisma.post.findMany({
      where: {
        clientId: client.id,
        status: "PUBLISHED",
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(
      {
        data: posts,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      }
    );
  } catch (error) {
    console.error("External API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
