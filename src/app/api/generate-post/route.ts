import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateBlogPost } from "@/lib/openai";
import { fetchCoverImage } from "@/lib/pexels";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic } = body;

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required" },
        { status: 400 }
      );
    }

    // Generate blog post with OpenAI
    const post = await generateBlogPost(topic.trim());

    // Fetch cover image from Pexels
    const imageUrl = await fetchCoverImage(post.keyword);

    return NextResponse.json({
      title: post.title,
      content: post.content,
      imageUrl,
      keyword: post.keyword,
    });
  } catch (error) {
    console.error("Generate post error:", error);
    return NextResponse.json(
      { error: "Failed to generate post. Please check your API keys." },
      { status: 500 }
    );
  }
}
