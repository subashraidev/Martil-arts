import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";

// Fetch CMS content
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "all";

    if (type === "blogs") {
      const blogs = await prisma.blogPost.findMany({
        include: { author: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(blogs);
    }

    if (type === "gallery") {
      const gallery = await prisma.galleryItem.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(gallery);
    }

    if (type === "announcements") {
      const session = await getSessionUser();
      const target = searchParams.get("target") || "all";
      
      const query: any = {};
      if (session) {
        if (session.role === "STUDENT") {
          query.target = { in: ["all", "students"] };
        } else if (session.role === "INSTRUCTOR") {
          query.target = { in: ["all", "instructors"] };
        }
      } else {
        query.target = "all";
      }

      // If specific target parameter passed (for admin selection)
      if (target !== "all" && session && session.role === "ADMIN") {
        query.target = target;
      }

      const announcements = await prisma.announcement.findMany({
        where: query,
        include: { author: { include: { profile: true } } },
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json(announcements);
    }

    // Default: Return basic statistics or aggregated lists
    return NextResponse.json({ message: "Specify type parameter (blogs, gallery, announcements)" });
  } catch (error) {
    console.error("Fetch CMS error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Create CMS content (Admin or Instructor for announcements)
export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session || session.role === "STUDENT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { type, title, content, summary, category, tags, image, url, album, target } = body;

    if (type === "blog") {
      if (session.role !== "ADMIN" && session.role !== "INSTRUCTOR") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
      
      if (!title || !content || !summary || !category) {
        return NextResponse.json({ error: "Missing blog fields" }, { status: 400 });
      }

      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

      const blog = await prisma.blogPost.create({
        data: {
          title,
          slug,
          content,
          summary,
          category,
          tags: tags || "",
          image: image || "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800",
          authorId: session.userId,
        },
      });
      return NextResponse.json({ success: true, blog });
    }

    if (type === "gallery") {
      if (session.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

      if (!url || !album) {
        return NextResponse.json({ error: "Missing url or album for gallery item" }, { status: 400 });
      }

      const item = await prisma.galleryItem.create({
        data: {
          url,
          album,
          type: url.includes("mp4") || url.includes("youtube") ? "video" : "image",
          title: title || "",
        },
      });
      return NextResponse.json({ success: true, item });
    }

    if (type === "announcement") {
      if (!title || !content) {
        return NextResponse.json({ error: "Missing title or content" }, { status: 400 });
      }

      const ann = await prisma.announcement.create({
        data: {
          title,
          content,
          target: target || "all",
          authorId: session.userId,
        },
      });
      return NextResponse.json({ success: true, announcement: ann });
    }

    return NextResponse.json({ error: "Invalid type specified" }, { status: 400 });
  } catch (error) {
    console.error("Create CMS error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
