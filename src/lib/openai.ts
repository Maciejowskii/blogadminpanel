import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

interface GeneratedPost {
  title: string;
  content: string;
  keyword: string;
}

export async function generateBlogPost(topic: string): Promise<GeneratedPost> {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert blog content writer. When given a topic, generate a high-quality, well-structured blog post. 

Your response MUST be valid JSON with exactly these fields:
- "title": A compelling, SEO-friendly blog post title
- "content": The full blog post in clean HTML format. Use <h2>, <h3> for subheadings, <p> for paragraphs, <ul>/<ol> for lists, <strong>/<em> for emphasis, <blockquote> for quotes. Do NOT include <html>, <head>, or <body> tags. The content should be 800-1200 words.
- "keyword": A single primary keyword (1-3 words) that best describes the main topic, suitable for searching stock photos.

Return ONLY the JSON object, no markdown code blocks or other formatting.`,
      },
      {
        role: "user",
        content: `Write a blog post about: ${topic}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 4000,
  });

  const responseText = completion.choices[0]?.message?.content?.trim() || "";

  // Try to parse JSON, handling potential markdown code block wrapping
  let cleanJson = responseText;
  if (cleanJson.startsWith("```")) {
    cleanJson = cleanJson.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  const parsed = JSON.parse(cleanJson) as GeneratedPost;

  return {
    title: parsed.title,
    content: parsed.content,
    keyword: parsed.keyword,
  };
}
