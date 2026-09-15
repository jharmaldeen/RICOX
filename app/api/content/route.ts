import { investors, testimonials, partners, blogPosts } from "@/lib/data";
import { json } from "@/lib/api";

export async function GET() {
  return json({ investors, testimonials, partners, posts: blogPosts });
}
