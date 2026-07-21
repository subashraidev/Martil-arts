import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, BookOpen, Clock } from "lucide-react";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function BlogReaderPage({ params }: RouteParams) {
  const { slug } = await params;

  const blog = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { include: { profile: true } },
    },
  });

  if (!blog) {
    notFound();
  }

  // Estimate reading time in minutes
  const wordCount = blog.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary-navy transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Articles
          </Link>
        </div>

        {/* Article Container */}
        <article className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {/* Cover image */}
          <div className="h-80 md:h-[450px] relative bg-slate-200">
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent flex items-end p-8">
              <span className="bg-martial-red text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-wider">
                {blog.category}
              </span>
            </div>
          </div>

          {/* Metadata & Title */}
          <div className="p-8 sm:p-12 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-semibold uppercase tracking-wider pb-6 border-b border-slate-100">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-accent-gold" />
                {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4 text-accent-gold" />
                Master {blog.author.profile?.firstName} {blog.author.profile?.lastName}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent-gold" />
                {readingTime} Min Read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-primary-navy font-display leading-tight">
              {blog.title}
            </h1>

            {/* Summary Block */}
            <p className="text-slate-500 font-medium italic border-l-4 border-martial-red pl-4 text-sm sm:text-base bg-slate-50 py-3 pr-4 rounded-r-xl">
              {blog.summary}
            </p>

            {/* Main Content Body */}
            <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-6 pt-4 whitespace-pre-line">
              {/* Replace markdown-style headings with structured style styling using inline format or simple processing */}
              {blog.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-lg sm:text-xl font-bold text-primary-navy font-display pt-4">
                      {paragraph.replace("### ", "")}
                    </h3>
                  );
                }
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-xl sm:text-2xl font-black text-primary-navy font-display pt-6">
                      {paragraph.replace("## ", "")}
                    </h2>
                  );
                }
                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                  return (
                    <p key={index} className="font-bold text-slate-800">
                      {paragraph.replace(/\*\*/g, "")}
                    </p>
                  );
                }
                return <p key={index}>{paragraph}</p>;
              })}
            </div>

            {/* Tags footer */}
            {blog.tags && (
              <div className="pt-8 border-t border-slate-100 flex flex-wrap gap-2 items-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Tags:</span>
                {blog.tags.split(",").map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border border-slate-200/50"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
