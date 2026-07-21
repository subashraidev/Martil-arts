import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, User, Calendar, ChevronRight } from "lucide-react";

export const revalidate = 0;

export default async function BlogListingPage() {
  const blogs = await prisma.blogPost.findMany({
    include: {
      author: { include: { profile: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Dojang Insights</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Academy Blog</h1>
          <p className="text-slate-500">
            Read articles and training guides written by our masters. Learn tips about home exercises, stretching routines, and child character building.
          </p>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((b) => (
            <article
              key={b.id}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image & tag */}
                <div className="h-52 bg-slate-200 relative">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-primary-navy text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {b.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Master {b.author.profile?.lastName || "Kim"}
                    </span>
                  </div>

                  <h2 className="text-lg font-black text-primary-navy leading-snug group-hover:text-martial-red">
                    <Link href={`/blog/${b.slug}`} className="hover:text-martial-red transition-colors">
                      {b.title}
                    </Link>
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {b.summary}
                  </p>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 pt-0 border-t border-slate-50 mt-4">
                <Link
                  href={`/blog/${b.slug}`}
                  className="text-xs font-bold text-martial-red hover:text-red-700 inline-flex items-center gap-1.5"
                >
                  Read Full Article <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
