import { prisma } from "@/lib/prisma";
import GalleryGrid from "@/components/GalleryGrid";

export const revalidate = 0;

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  // Extract unique albums
  const albums = ["All", ...Array.from(new Set(items.map((i) => i.album)))];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <span className="text-sm font-bold text-martial-red tracking-wider uppercase">Academy Media</span>
          <h1 className="text-4xl font-black text-primary-navy font-display">Photo & Video Gallery</h1>
          <p className="text-slate-500">
            Take a look inside our dojang. Explore highlights from our classes, belt promotion ceremonies, and sparring competitions.
          </p>
        </div>

        {/* Gallery Grid Client Component */}
        <GalleryGrid initialItems={items} albums={albums} />
      </div>
    </div>
  );
}
