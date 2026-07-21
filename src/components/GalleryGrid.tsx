"use client";

import { useState } from "react";
import { Play, X, ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryItem {
  id: number;
  url: string;
  type: string;
  album: string;
  title: string | null;
}

interface GalleryGridProps {
  initialItems: GalleryItem[];
  albums: string[];
}

export default function GalleryGrid({ initialItems, albums }: GalleryGridProps) {
  const [selectedAlbum, setSelectedAlbum] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const filteredItems = selectedAlbum === "All"
    ? initialItems
    : initialItems.filter((item) => item.album === selectedAlbum);

  const openLightbox = (id: number) => {
    const idx = filteredItems.findIndex((item) => item.id === id);
    if (idx !== -1) setLightboxIdx(idx);
  };

  const closeLightbox = () => setLightboxIdx(null);

  const nextSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((prev) => (prev! + 1) % filteredItems.length);
  };

  const prevSlide = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (lightboxIdx === null) return;
    setLightboxIdx((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  const activeItem = lightboxIdx !== null ? filteredItems[lightboxIdx] : null;

  return (
    <div className="space-y-8">
      {/* Album Filters */}
      <div className="flex flex-wrap justify-center gap-3">
        {albums.map((album) => (
          <button
            key={album}
            onClick={() => {
              setSelectedAlbum(album);
              closeLightbox();
            }}
            className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedAlbum === album
                ? "bg-primary-navy text-white shadow-md"
                : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            {album}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            onClick={() => openLightbox(item.id)}
            className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden aspect-square cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <img
              src={item.url}
              alt={item.title || "Gallery Item"}
              className="w-full h-full object-cover"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 bg-slate-950/20 flex items-center justify-center">
                <div className="bg-white/95 text-slate-900 p-3.5 rounded-full shadow-lg">
                  <Play className="h-4.5 w-4.5 fill-current" />
                </div>
              </div>
            )}
            {/* Title Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-5">
              <span className="text-[9px] font-black bg-martial-red text-white w-max px-2 py-0.5 rounded uppercase tracking-wider mb-1.5">
                {item.album}
              </span>
              <h4 className="text-xs font-bold text-white truncate">{item.title || "Academy Class"}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 md:p-8"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-slate-900/60 z-50"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Nav buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-6 text-white/70 hover:text-white bg-slate-900/60 hover:bg-slate-900 p-3 rounded-full hover:scale-105 transition-all cursor-pointer z-50"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 text-white/70 hover:text-white bg-slate-900/60 hover:bg-slate-900 p-3 rounded-full hover:scale-105 transition-all cursor-pointer z-50"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Media Container */}
          <div className="relative max-w-4xl max-h-[80vh] w-full flex flex-col items-center">
            <img
              src={activeItem.url}
              alt={activeItem.title || "Gallery"}
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} // prevent close
            />
            {activeItem.title && (
              <div 
                className="bg-slate-950/80 border border-slate-900 text-center text-xs font-semibold py-3 px-6 rounded-full text-white mt-4 max-w-md truncate"
                onClick={(e) => e.stopPropagation()}
              >
                {activeItem.title} - <span className="text-accent-gold">{activeItem.album}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
