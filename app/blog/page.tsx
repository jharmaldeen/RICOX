import type { Metadata } from "next";
import { blogPosts } from "@/lib/data";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = { title: "Crypto Blog & Insights | RICOX" };

export default function BlogPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="hero-glow starfield pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold text-white">Crypto Blog & Insights</h1>
          <p className="mt-6 text-lg text-muted">
            Stay updated with the latest news, market analysis, and expert insights on cryptocurrency and blockchain
            technology.
          </p>
        </div>
        <h2 className="mt-16 text-2xl font-bold text-white">Featured Articles</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <article key={post.slug} className="glass rounded-2xl p-6">
              <p className="text-xs text-accent-2">{post.date}</p>
              <h3 className="mt-2 text-lg font-semibold text-white">{post.title}</h3>
              <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted">
                By {post.author} · {post.read}
              </p>
            </article>
          ))}
        </div>
        <div className="mx-auto mt-16 max-w-xl text-center">
          <h2 className="text-2xl font-bold text-white">Stay Updated on Crypto Opportunities</h2>
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
